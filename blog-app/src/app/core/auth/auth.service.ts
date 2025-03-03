import { Injectable, NgZone, inject, ApplicationRef } from '@angular/core';
import { 
  Auth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  updateProfile,
  browserPopupRedirectResolver,
  sendSignInLinkToEmail,
  sendPasswordResetEmail,
  getAuth
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  docData,
  updateDoc,
  serverTimestamp,
  enableIndexedDbPersistence,
  collection,
  query,
  where,
  getDocs,
  documentId
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { 
  Observable, 
  from, 
  switchMap, 
  of, 
  tap, 
  map, 
  catchError 
} from 'rxjs';
import { ErrorService } from '../services/error.service';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private errorService = inject(ErrorService);
  private app = inject(ApplicationRef);
  
  private readonly actionCodeSettings = {
    url: `${window.location.origin}/auth/complete-signup`,
    handleCodeInApp: true
  };

  constructor() {
    enableIndexedDbPersistence(this.firestore)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
          console.warn('The current browser doesn\'t support persistence.');
        }
      });

    this.profile$.subscribe({
      next: (profile) => {
        if (profile) {
          console.group('🔐 Current User Profile');
          console.log('UID:', profile.uid);
          console.log('Email:', profile.email);
          console.log('Role:', profile.role);
          console.log('Display Name:', profile.displayName);
          console.groupEnd();
        } else {
          console.log('🚪 No user profile currently loaded');
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  readonly currentUser$ = user(this.auth);
  readonly currentUser = toSignal(this.currentUser$);

  readonly profile$ = this.currentUser$.pipe(
    switchMap(user => user ? this.getUserProfile$(user.uid) : of(null))
  );
  readonly profile = toSignal(this.profile$);

  private getUserProfile$(uid: string): Observable<UserProfile | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef, { idField: 'uid' }).pipe(
      map(data => {
        const isValidUserProfile = (profile: any): profile is UserProfile => {
          return (
            typeof profile === 'object' &&
            profile !== null &&
            typeof profile.uid === 'string' &&
            typeof profile.email === 'string' &&
            typeof profile.displayName === 'string' &&
            ['admin', 'author', 'user'].includes(profile.role)
          );
        };

        if (data && isValidUserProfile(data)) {
          console.log(`🔍 Retrieved profile for UID: ${uid}`, data);
          return data;
        } else {
          console.log(`❌ Invalid or missing profile for UID: ${uid}`, data);
          return null;
        }
      }),
      catchError(error => {
        console.error(`❌ Error fetching profile for UID: ${uid}`, error);
        return of(null);
      })
    );
  }

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const credential = await signInWithPopup(
        this.auth, 
        provider,
        browserPopupRedirectResolver
      );
      
      console.log('🌐 Google Sign-In Successful', {
        uid: credential.user.uid,
        email: credential.user.email
      });

      await this.createUserProfile(credential.user);
      
      this.ngZone.run(() => {
        this.router.navigate(['/']);
        this.errorService.showSuccess('Successfully signed in!');
      });

      this.app.tick();
    } catch (error) {
      console.error('❌ Google Sign-In Failed', error);
      this.ngZone.run(() => this.errorService.showError(error));
      throw error;
    }
  }

  async emailSignIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      console.log('📧 Email Sign-In Successful', {
        uid: result.user.uid,
        email: result.user.email
      });

      this.ngZone.run(() => {
        this.router.navigate(['/']);
        this.errorService.showSuccess('Successfully signed in!');
      });

      this.app.tick();
    } catch (error) {
      console.error('❌ Email Sign-In Failed', error);
      this.ngZone.run(() => this.errorService.showError(error));
      throw error;
    }
  }

  async emailSignUp(email: string, password: string, displayName: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      console.log('📝 Email Sign-Up Successful', {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName
      });

      await this.createUserProfile({
        ...credential.user,
        displayName
      });

      await this.handleInviteSignUp(email);

      this.ngZone.run(() => {
        this.router.navigate(['/']);
        this.errorService.showSuccess('Account created successfully!');
      });

      this.app.tick();
    } catch (error) {
      console.error('❌ Email Sign-Up Failed', error);
      this.ngZone.run(() => this.errorService.showError(error));
      throw error;
    }
  }

  async signOut() {
    try {
      const currentUser = this.currentUser();
      console.log('🚪 Signing Out', {
        uid: currentUser?.uid,
        email: currentUser?.email
      });

      await signOut(this.auth);
      
      this.ngZone.run(() => {
        this.router.navigate(['/auth/login']);
        this.errorService.showSuccess('Successfully signed out!');
      });

      this.app.tick();
    } catch (error) {
      console.error('❌ Sign-Out Failed', error);
      this.ngZone.run(() => this.errorService.showError(error));
      throw error;
    }
  }

  private async createUserProfile(user: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL,
        role: 'user',
        isActive: true,
        createdAt: serverTimestamp() as any // Firestore timestamp will be converted to Date when read
      };

      console.log('👤 Creating New User Profile', newProfile);
      await setDoc(userRef, newProfile);
    } else {
      console.log('👤 User profile already exists', userSnap.data());
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    const user = this.currentUser();
    if (!user) throw new Error('No authenticated user');
  
    try {
      console.group('🔄 Updating User Profile');
      console.log('Current User:', user.uid);
      console.log('Updates:', updates);

      if (updates.displayName) {
        await updateProfile(user, {
          displayName: updates.displayName
        });
      }
      
      if (updates.photoURL) {
        await updateProfile(user, {
          photoURL: updates.photoURL
        });
      }
      
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Profile Updated Successfully');
      console.groupEnd();
    } catch (error) {
      console.error('❌ Profile Update Error:', error);
      console.groupEnd();
      throw error;
    }
  }

  logCurrentUserRole() {
    const profile = this.profile();
    if (profile) {
      console.group('🔍 Current User Role Lookup');
      console.log('UID:', profile.uid);
      console.log('Email:', profile.email);
      console.log('Role:', profile.role);
      console.log('Display Name:', profile.displayName);
      console.groupEnd();
    } else {
      console.log('🚫 No user profile currently available');
    }
  }

  private isValidRole(role: string): boolean {
    return ['admin', 'author', 'user'].includes(role);
  }

  async handleInviteSignUp(email: string) {
    const role = localStorage.getItem('invitedRole');
    if (role && this.isValidRole(role)) {
      const user = this.currentUser();
      if (user) {
        await this.updateUserRole(user.uid, role as UserProfile['role']);
        localStorage.removeItem('invitedRole');
      }
    }
  }

  async updateUserRole(uid: string, newRole: UserProfile['role']): Promise<void> {
    const currentUser = this.currentUser();
    if (!currentUser || this.profile()?.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can modify roles');
    }

    try {
      console.group('🔄 Updating User Role');
      const userRef = doc(this.firestore, `users/${uid}`);
      const auditRef = doc(collection(this.firestore, 'roleChangeAudit'));
      
      await Promise.all([
        updateDoc(userRef, { 
          role: newRole,
          updatedAt: serverTimestamp()
        }),
        setDoc(auditRef, {
          userId: uid,
          previousRole: this.profile()?.role,
          newRole,
          changedBy: currentUser.uid,
          timestamp: serverTimestamp()
        })
      ]);

      console.log('✅ Role Updated Successfully');
    } catch (error) {
      console.error('❌ Role Update Error:', error);
      console.groupEnd();
      throw error;
    }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        isActive: true // Assuming active status managed differently
      } as UserProfile));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }
}
