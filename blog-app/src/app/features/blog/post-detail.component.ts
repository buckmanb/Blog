// src/app/features/blog/post-detail.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogService, BlogPost } from '../../core/services/blog.service';
import { AuthService } from '../../core/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (!post()) {
        <div class="not-found">
          <h2>Post not found</h2>
          <p>The post you are looking for does not exist or has been removed.</p>
          <a mat-button routerLink="/blog" color="primary">Back to Posts</a>
        </div>
      } @else {
        <div class="post-header">
          <h1 class="post-title">{{ post()?.title }}</h1>
          
          <div class="post-meta">
            <div class="author-info">
              @if (post()?.authorPhotoURL) {
                <img [src]="post()?.authorPhotoURL" alt="Author" class="author-image">
              } @else {
                <mat-icon class="author-icon">account_circle</mat-icon>
              }
              <span>{{ post()?.authorName }}</span>
            </div>
            
            <div class="post-date">
              <mat-icon>calendar_today</mat-icon>
              <span>{{ formatDate(post()?.publishedAt) }}</span>
            </div>
          </div>
          
          @if (post()?.tags?.length) {
            <div class="post-tags">
              @for (tag of post()?.tags; track tag) {
                <mat-chip>{{ tag }}</mat-chip>
              }
            </div>
          }
          
          <!-- Edit button for author -->
          @if (isAuthor()) {
            <div class="edit-actions">
              <a mat-button color="primary" [routerLink]="['/blog', post()?.id, 'edit']">
                <mat-icon>edit</mat-icon> Edit Post
              </a>
            </div>
          }
        </div>
        
        @if (post()?.imageUrl) {
          <div class="post-image-container">
            <img [src]="post()?.imageUrl" alt="{{ post()?.title }}" class="post-image">
          </div>
        }
        
        <mat-card class="post-content-card">
          <mat-card-content>
            <div class="post-content" [innerHTML]="sanitizedContent()"></div>
          </mat-card-content>
          
          <mat-divider class="content-divider"></mat-divider>
          
          <mat-card-actions>
            <button mat-button (click)="likePost()" [disabled]="liking()" color="primary">
              <mat-icon>{{ liked() ? 'favorite' : 'favorite_border' }}</mat-icon>
              Like ({{ post()?.likes || 0 }})
            </button>
            
            <button mat-button [disabled]="sharing()">
              <mat-icon>share</mat-icon>
              Share
            </button>
          </mat-card-actions>
        </mat-card>
        
        <!-- Comments section placeholder -->
        <div class="comments-section">
          <h2>Comments</h2>
          <p>Comments will be implemented in a future update.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 16px;
    }
    
    .loading-container, .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      gap: 16px;
      text-align: center;
    }
    
    .post-header {
      margin-bottom: 24px;
    }
    
    .post-title {
      font-size: 2.5rem;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    
    .post-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    
    .author-info, .post-date {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .author-image {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .author-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
    }
    
    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .edit-actions {
      margin-top: 16px;
    }
    
    .post-image-container {
      margin-bottom: 24px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--elevation-2);
    }
    
    .post-image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
    }
    
    .post-content-card {
      margin-bottom: 32px;
    }
    
    .post-content {
      font-size: 1.1rem;
      line-height: 1.7;
    }
    
    .content-divider {
      margin: 24px 0;
    }
    
    .comments-section {
      margin-top: 32px;
      margin-bottom: 64px;
    }
    
    /* Make sure images in the content are responsive */
    ::ng-deep .post-content img {
      max-width: 100%;
      height: auto;
    }
    
    /* Style code blocks in the content */
    ::ng-deep .post-content pre {
      background-color: var(--surface-color);
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
    }
    
    /* Style links in the content */
    ::ng-deep .post-content a {
      color: var(--primary-color);
      text-decoration: none;
    }
    
    ::ng-deep .post-content a:hover {
      text-decoration: underline;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  
  loading = signal<boolean>(true);
  post = signal<BlogPost | null>(null);
  liked = signal<boolean>(false);
  liking = signal<boolean>(false);
  sharing = signal<boolean>(false);
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id');
      if (postId) {
        this.loadPost(postId);
      }
    });
  }
  
  async loadPost(postId: string) {
    this.loading.set(true);
    
    try {
      // This would be implemented in the BlogService
      // For now, we'll use a mock implementation
      
      // Simulating getting post by ID
      const posts = await this.blogService.getPublishedPosts();
      const foundPost = posts.find(p => p.id === postId);
      
      this.post.set(foundPost || null);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      this.loading.set(false);
    }
  }
  
  isAuthor(): boolean {
    const currentUser = this.authService.currentUser();
    return !!currentUser && currentUser.uid === this.post()?.authorId;
  }
  
  sanitizedContent() {
    if (!this.post()) return '';
    return this.sanitizer.bypassSecurityTrustHtml(this.post()?.content || '');
  }
  
  formatDate(timestamp: any): string {
    if (!timestamp) {
      return '';
    }
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric', 
      year: 'numeric'
    });
  }
  
  likePost() {
    // This would be implemented in the BlogService
    this.liking.set(true);
    setTimeout(() => {
      this.liked.update(value => !value);
      if (this.post()) {
        const post = { ...this.post()! };
        post.likes = (post.likes || 0) + (this.liked() ? 1 : -1);
        this.post.set(post);
      }
      this.liking.set(false);
    }, 500);
  }
}