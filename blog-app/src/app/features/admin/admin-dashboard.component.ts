// src/app/features/admin/admin-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="admin-container">
      <h1 class="page-title">Admin Dashboard</h1>
      
      <div class="admin-grid">
        <!-- Quick stats cards -->
        <div class="stats-row">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-value">42</div>
                <div class="stat-label">Total Posts</div>
              </div>
              <mat-icon class="stat-icon">article</mat-icon>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-value">18</div>
                <div class="stat-label">Users</div>
              </div>
              <mat-icon class="stat-icon">people</mat-icon>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-value">256</div>
                <div class="stat-label">Comments</div>
              </div>
              <mat-icon class="stat-icon">comment</mat-icon>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-value">1,024</div>
                <div class="stat-label">Total Views</div>
              </div>
              <mat-icon class="stat-icon">visibility</mat-icon>
            </mat-card-content>
          </mat-card>
        </div>
        
        <!-- Admin nav cards -->
        <div class="admin-sections">
          <mat-card class="admin-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>article</mat-icon>
              <mat-card-title>Manage Posts</mat-card-title>
              <mat-card-subtitle>Edit, publish, and remove blog posts</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>View and manage all posts across the platform. Moderate content, approve drafts, and feature important posts.</p>
            </mat-card-content>
            
            <mat-card-actions>
              <a mat-button routerLink="/admin/posts" color="primary">MANAGE POSTS</a>
            </mat-card-actions>
          </mat-card>
          
          <mat-card class="admin-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>people</mat-icon>
              <mat-card-title>Manage Users</mat-card-title>
              <mat-card-subtitle>View and manage user accounts</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>Manage user accounts, assign roles, and handle permissions across the platform.</p>
            </mat-card-content>
            
            <mat-card-actions>
              <a mat-button routerLink="/admin/users" color="primary">MANAGE USERS</a>
            </mat-card-actions>
          </mat-card>
          
          <mat-card class="admin-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>comment</mat-icon>
              <mat-card-title>Manage Comments</mat-card-title>
              <mat-card-subtitle>Approve and moderate user comments</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>Review, moderate, and approve comments. Manage the discussion on your blog.</p>
            </mat-card-content>
            
            <mat-card-actions>
              <a mat-button routerLink="/admin/comments" color="primary">MANAGE COMMENTS</a>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }
    
    .page-title {
      margin-bottom: 24px;
      font-size: 2rem;
    }
    
    .admin-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .stat-card {
      height: 100%;
    }
    
    .stat-card .mat-card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }
    
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: 500;
      line-height: 1;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .stat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-color);
      opacity: 0.7;
    }
    
    .admin-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .admin-card {
      height: 100%;
    }
    
    .admin-card .mat-card-content {
      padding-top: 16px;
      flex-grow: 1;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .admin-sections {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent {}