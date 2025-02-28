// src/app/features/admin/admin-dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommentService } from '../../core/services/comment.service';
import { BlogService } from '../../core/services/blog.service';
import { AuthService } from '../../core/auth/auth.service';

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
                <div class="stat-value">{{ totalPosts() }}</div>
                <div class="stat-label">Total Posts</div>
              </div>
              <mat-icon class="stat-icon">article</mat-icon>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-value">{{ totalUsers() }}</div>
                <div class="stat-label">Users</div>
              </div>
              <mat-icon class="stat-icon">people</mat-icon>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card" [routerLink]="['/admin/moderation']">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-value">{{ pendingComments() }}</div>
                <div class="stat-label">Pending Comments</div>
              </div>
              <mat-icon class="stat-icon" [class.notification]="pendingComments() > 0">comment</mat-icon>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-value">{{ totalViews() }}</div>
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
              <mat-icon mat-card-avatar [class.attention]="pendingComments() > 0 || flaggedComments() > 0">comment</mat-icon>
              <mat-card-title>Comment Moderation</mat-card-title>
              <mat-card-subtitle>
                Approve and moderate user comments
                <span *ngIf="pendingComments() > 0" class="notification-badge">{{ pendingComments() }} pending</span>
              </mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>Review, moderate, and approve comments. Handle flagged content and manage the discussion on your blog.</p>
              
              <div class="moderation-stats" *ngIf="pendingComments() > 0 || flaggedComments() > 0">
                <div class="mod-stat" *ngIf="pendingComments() > 0">
                  <span class="mod-label">Pending:</span> 
                  <span class="mod-value">{{ pendingComments() }}</span>
                </div>
                <div class="mod-stat" *ngIf="flaggedComments() > 0">
                  <span class="mod-label">Flagged:</span> 
                  <span class="mod-value">{{ flaggedComments() }}</span>
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <a mat-button routerLink="/admin/moderation" color="primary">MODERATE COMMENTS</a>
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
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--elevation-3);
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
    
    .stat-icon.notification {
      color: var(--warning-color);
      animation: pulse 2s infinite;
    }
    
    .admin-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .admin-card {
      height: 100%;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .admin-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--elevation-3);
    }
    
    .admin-card .mat-card-content {
      padding-top: 16px;
      flex-grow: 1;
    }
    
    .attention {
      color: var(--warning-color);
    }
    
    .notification-badge {
      background-color: var(--error-color);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      margin-left: 8px;
    }
    
    .moderation-stats {
      margin-top: 16px;
      display: flex;
      gap: 16px;
    }
    
    .mod-stat {
      padding: 4px 12px;
      border-radius: 16px;
      background-color: var(--surface-color);
      font-size: 0.9rem;
    }
    
    .mod-label {
      color: var(--text-secondary);
    }
    
    .mod-value {
      font-weight: 500;
    }
    
    @keyframes pulse {
      0% {
        opacity: 0.7;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.7;
      }
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
export class AdminDashboardComponent implements OnInit {
  private commentService = inject(CommentService);
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  
  // Dashboard statistics
  totalPosts = signal<number>(42);
  totalUsers = signal<number>(18);
  pendingComments = signal<number>(0);
  flaggedComments = signal<number>(0);
  totalViews = signal<number>(1024);
  
  ngOnInit() {
    // Only fetch data if the user is an admin
    if (this.authService.profile()?.role === 'admin') {
      this.loadDashboardStats();
      
      // Subscribe to changes in pending comments
      this.commentService.pendingCommentsChanged$.subscribe(() => {
        this.loadCommentStats();
      });
    }
  }
  
  async loadDashboardStats() {
    this.loadCommentStats();
    // Load other stats as needed
  }
  
  async loadCommentStats() {
    try {
      // Get pending comments count
      const pendingResult = await this.commentService.getPendingCommentsWithCount();
      this.pendingComments.set(pendingResult.count);
      
      // Get flagged comments count
      const flaggedResult = await this.commentService.getFlaggedCommentsWithCount();
      this.flaggedComments.set(flaggedResult.count);
    } catch (error) {
      console.error('Error loading comment stats:', error);
    }
  }
}