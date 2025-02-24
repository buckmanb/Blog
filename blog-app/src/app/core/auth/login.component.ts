// src/app/core/auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="flex justify-center items-center min-h-[80vh]">
      <mat-card class="max-w-md w-full m-4">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 mt-4">
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" [readonly]="loading()">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" [readonly]="loading()">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="!loginForm.valid || loading()"
                    class="w-full relative h-[36px]">
              <span [class.opacity-0]="loading()">Login</span>
              <mat-progress-spinner
                *ngIf="loading()"
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                [diameter]="24"
                [strokeWidth]="2"
                mode="indeterminate">
              </mat-progress-spinner>
            </button>
          </form>

          <mat-divider class="my-4"></mat-divider>

          <button mat-stroked-button 
                  (click)="onGoogleLogin()"
                  [disabled]="loading()"
                  class="w-full google-btn">
            <div class="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" class="google-icon">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {{ loading() ? 'Logging in...' : 'Login with Google' }}
            </div>
          </button>

          <div class="mt-4 text-center">
            <a mat-button routerLink="/auth/signup" [disabled]="loading()">
              Need an account? Sign up
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .google-btn {
      height: 40px !important;
      font-weight: 500 !important;
      letter-spacing: 0.25px;
      border: 1px solid #dadce0 !important;
      background-color: white !important;
      color: #3c4043 !important;
      transition: all 0.2s ease;
      
      &:hover:not([disabled]) {
        background-color: #f8f9fa !important;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15) !important;
      }

      .google-icon {
        margin-right: 8px;
        vertical-align: middle;
      }
    }

    :host {
      display: block;
    }

    .my-4 {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .mt-4 {
      margin-top: 1rem;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);

  loginForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal<boolean>(false);

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        this.loading.set(true);
        const { email, password } = this.loginForm.getRawValue();
        await this.authService.emailSignIn(email, password);
      } catch (error: any) {
        console.error('Login error:', error);
      } finally {
        this.loading.set(false);
      }
    }
  }

  async onGoogleLogin() {
    try {
      this.loading.set(true);
      await this.authService.googleSignIn();
    } catch (error: any) {
      console.error('Google login error:', error);
    } finally {
      this.loading.set(false);
    }
  }
}