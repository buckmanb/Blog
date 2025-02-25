// src/app/features/admin/admin-posts.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="container">
      <h1>Admin Posts Management</h1>
      <p>This component will provide functionality to manage all blog posts.</p>
      <mat-card>
        <mat-card-content>
          <p>Coming soon: Post management interface</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
  `]
})
export class AdminPostsComponent {}