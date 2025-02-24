// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ThemeToggleComponent } from './shared/components/theme-toggle.component';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    ThemeToggleComponent
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <span class="app-title">Blog App</span>
        
        <div class="toolbar-spacer"></div>
        
        <app-theme-toggle></app-theme-toggle>
        
        @if (authService.currentUser()) {
          <button mat-flat-button color="primary" (click)="authService.signOut()">
            Sign Out
          </button>
        }
      </mat-toolbar>

      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: background-color 0.3s ease;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .app-title {
      font-size: 1.5rem;
      font-weight: 300;
      letter-spacing: 0.5px;
    }

    .app-content {
      margin-top: 64px; // Toolbar height
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
}