// src/app/features/user/profile.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileImageUploadComponent } from '../../shared/components/profile-image-upload.component';
import { CloudinaryUploadResult } from '../../core/services/cloudinary.service';
import { AuthService } from '../../core/auth/auth.service';
import { UserProfile } from '../../core/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ProfileImageUploadComponent
  ],
  template: `
    <div class="container p-4">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>Your Profile</mat-card-title>
        </mat-card-header>
        
        <mat-card-content class="p-4">
          <div class="profile-layout">
            <div class="profile-image-section">
              <app-profile-image-upload
                [currentImageUrl]="userProfile()?.photoURL || ''"
                (imageUploaded)="onProfileImageUploaded($event)"
                (imageRemoved)="onProfileImageRemoved()">
              </app-profile-image-upload>
            </div>
            
            <div class="profile-form-section">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
                <mat-form-field appearance="outline">
                  <mat-label>Display Name</mat-label>
                  <input matInput formControlName="displayName" placeholder="Your name">
                  <mat-error *ngIf="profileForm.get('displayName')?.hasError('required')">
                    Display name is required
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" placeholder="Your email" readonly>
                </mat-form-field>
                
                <div class="button-row">
                  <button mat-raised-button 
                          color="primary" 
                          type="submit"
                          [disabled]="!profileForm.valid || saving()">
                    {{ saving() ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .profile-card {
      background-color: var(--card-background);
    }
    
    .profile-layout {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .profile-image-section {
      display: flex;
      justify-content: center;
    }
    
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .button-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    
    @media (min-width: 768px) {
      .profile-layout {
        flex-direction: row;
        align-items: flex-start;
      }
      
      .profile-image-section {
        flex: 0 0 200px;
      }
      
      .profile-form-section {
        flex: 1;
      }
    }
  `]
})
export class UserProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  
  userProfile = this.authService.profile;
  saving = signal<boolean>(false);
  profileImageData = signal<CloudinaryUploadResult | null>(null);
  
  profileForm = this.fb.group({
    displayName: ['', Validators.required],
    email: [{ value: '', disabled: true }]
  });
  
  ngOnInit() {
    // Load current user data
    if (this.userProfile()) {
      this.profileForm.patchValue({
        displayName: this.userProfile()?.displayName || '',
        email: this.userProfile()?.email || ''
      });
    }
  }
  
  onProfileImageUploaded(result: CloudinaryUploadResult) {
    this.profileImageData.set(result);
  }
  
  onProfileImageRemoved() {
    this.profileImageData.set(null);
  }
  
  async onSubmit() {
    if (this.profileForm.valid) {
      try {
        this.saving.set(true);
        
        const updatedProfile: Partial<UserProfile> = {
          displayName: this.profileForm.getRawValue().displayName || '',
        };
        
        if (this.profileImageData()) {
          updatedProfile.photoURL = this.profileImageData()?.secure_url;
        }
        
        // Update the user profile via the AuthService (to be implemented)
        await this.authService.updateUserProfile(updatedProfile);
        
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
        });
      } catch (error) {
        this.snackBar.open('Failed to update profile', 'Close', {
          duration: 3000,
        });
        console.error('Profile update error:', error);
      } finally {
        this.saving.set(false);
      }
    }
  }
}