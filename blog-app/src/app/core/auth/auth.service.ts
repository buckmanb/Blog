// src/app/core/auth/auth.service.ts
import { Injectable, NgZone, inject, ApplicationRef } from '@angular/core';
import { 
  Auth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  browserPopupRedirectResolver
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  docData,
  enableIndexedDbPersistence
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, from, switchMap, of, tap } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'author' | 'user';
}

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

  constructor() {
    // Enable offline persistence
    enableIndexedDbPersistence(this.firestore)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
          console.warn('The current browser doesn\'t support persistence.');
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
    return docData(userRef) as Observable<UserProfile>;
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
      
      await this.createUserProfile(credential.user);
      
      this.ngZone.run(() => {
        this.router.navigate(['/']);
        this.errorService.showSuccess('Successfully signed in!');
      });

      // Trigger change detection
      this.app.tick();
    } catch (error) {
      this.ngZone.run(() => this.errorService.showError(error));
      throw error;
    }
  }

  async emailSignIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      this.ngZone.run(() => {
        this.router.navigate(['/']);
        this.errorService.showSuccess('Successfully signed in!');
      });

      // Trigger change detection
      this.app.tick();
    } catch (error) {
      this.ngZone.run(() => this.errorService.showError(error));
      throw error;
    }
  }

  async emailSignUp(email: string, password: string, displayName: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.createUserProfile({
        ...credential.user,
        displayName
      });

      this.ngZone.run(() => {
        this.router.navigate(['/']);
        this.errorService.showSuccess('Account created successfully!');
      });

      // Trigger change detection
      this.app.tick();
    } catch (error) {
      this.ngZone.run(() => this.errorService.showError(error));
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      
      this.ngZone.run(() => {
        this.router.navigate(['/auth/login']);
        this.errorService.showSuccess('Successfully signed out!');
      });

      // Trigger change detection
      this.app.tick();
    } catch (error) {
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
        role: 'user'
      };

      await setDoc(userRef, newProfile);
    }
  }
}