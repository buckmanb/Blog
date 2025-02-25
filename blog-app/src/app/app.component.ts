// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ThemeToggleComponent } from './shared/components/theme-toggle.component';
import { AuthService } from './core/auth/auth.service';
import { NavbarComponent } from './layout/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    ThemeToggleComponent,
    NavbarComponent
  ],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>

      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer">
        <div class="container">
          <p>&copy; {{ currentYear }} Blog App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
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
    
    .footer {
      padding: 1rem;
      background-color: var(--surface-color);
      border-top: 1px solid var(--border-color);
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  currentYear = new Date().getFullYear();
}