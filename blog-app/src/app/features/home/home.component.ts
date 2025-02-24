// src/app/features/home/home.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl">Welcome to the Blog</h1>
        
        <button mat-raised-button 
                color="primary" 
                routerLink="/blog/create"
                class="create-post-btn">
          <mat-icon>add</mat-icon>
          Create Post
        </button>
      </div>

      <!-- Blog post list will go here -->
    </div>
  `,
  styles: [`
    .create-post-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class HomeComponent {
  authService = inject(AuthService);
}