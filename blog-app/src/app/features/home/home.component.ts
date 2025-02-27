// src/app/features/home/home.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { BlogService, BlogPost } from '../../core/services/blog.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterLink, 
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl">Welcome to my social media site, you can vist <a href="https://beaubuckman.com">beaubuckman.com</a> to contact me.</h1>        
        <button mat-raised-button 
                color="primary" 
                routerLink="/blog/create"
                class="create-post-btn"
                *ngIf="authService.profile()?.role === 'admin' || authService.profile()?.role === 'author'">
          <mat-icon>add</mat-icon>
          Create Post
        </button>
      </div>

      <!-- Featured posts section -->
      <div class="featured-posts-section" *ngIf="featuredPosts().length > 0">
        <h2 class="section-title">Featured Posts</h2>
        <div class="featured-posts-container">
          <mat-card *ngFor="let post of featuredPosts()" class="featured-post-card" [routerLink]="['/blog', post.id]">
            <img *ngIf="post.imageUrl" [src]="post.imageUrl" [alt]="post.title" class="featured-post-image">
            <mat-card-content>
              <h3 class="featured-post-title">{{ post.title }}</h3>
              <p class="featured-post-excerpt">{{ generateExcerpt(post) }}</p>
              <div class="featured-post-meta">
                <span class="featured-post-date">{{ formatDate(post.publishedAt) }}</span>
                <div class="featured-post-tags" *ngIf="post.tags?.length">
                  <mat-chip *ngFor="let tag of post.tags.slice(0, 2)">{{ tag }}</mat-chip>
                  <span *ngIf="post.tags.length > 2">+{{ post.tags.length - 2 }} more</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Recent posts section -->
      <div class="recent-posts-section">
        <h2 class="section-title">Recent Posts</h2>
        
        <div *ngIf="loading()" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div *ngIf="!loading() && posts().length === 0" class="no-posts-message">
          <p>No posts found. Check back later for new content!</p>
        </div>
        
        <div class="posts-grid" *ngIf="!loading() && posts().length > 0">
          <mat-card *ngFor="let post of posts()" class="post-card" [routerLink]="['/blog', post.id]">
            <img *ngIf="post.imageUrl" [src]="post.imageUrl" [alt]="post.title" class="post-image">
            <mat-card-content>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ generateExcerpt(post) }}</p>
              
              <div class="post-meta">
                <div class="post-author" *ngIf="post.authorName">
                  <img *ngIf="post.authorPhotoURL" [src]="post.authorPhotoURL" alt="Author" class="author-image">
                  <mat-icon *ngIf="!post.authorPhotoURL">account_circle</mat-icon>
                  <span>{{ post.authorName }}</span>
                </div>
                
                <span class="post-date">{{ formatDate(post.publishedAt) }}</span>
              </div>
              
              <div class="post-tags" *ngIf="post.tags?.length">
                <mat-chip *ngFor="let tag of post.tags.slice(0, 3)">{{ tag }}</mat-chip>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-button [routerLink]="['/blog', post.id]">Read More</button>
            </mat-card-actions>
          </mat-card>
        </div>
        
        <div class="view-all-button" *ngIf="posts().length > 0">
          <button mat-button color="primary" routerLink="/blog">
            View All Posts
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-post-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--primary-lighter);
      padding-bottom: 0.5rem;
    }

    /* Featured posts styles */
    .featured-posts-section {
      margin-bottom: 3rem;
    }

    .featured-posts-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .featured-post-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .featured-post-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--elevation-3);
    }

    .featured-post-image {
      height: 180px;
      object-fit: cover;
    }

    .featured-post-title {
      font-size: 1.25rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .featured-post-excerpt {
      color: var(--text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }

    .featured-post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .featured-post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    /* Recent posts styles */
    .recent-posts-section {
      margin-bottom: 2rem;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .post-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--elevation-3);
    }

    .post-image {
      height: 160px;
      object-fit: cover;
    }

    .post-title {
      font-size: 1.2rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .post-excerpt {
      color: var(--text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }

    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .author-image {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    .post-author mat-icon {
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .view-all-button {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .no-posts-message {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .featured-posts-container,
      .posts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  private blogService = inject(BlogService);
  
  loading = signal<boolean>(true);
  posts = signal<BlogPost[]>([]);
  featuredPosts = signal<BlogPost[]>([]);
  
  ngOnInit() {
    this.loadPosts();
    this.loadFeaturedPosts();
  }
  
  async loadPosts() {
    try {
      this.loading.set(true);
      const posts = await this.blogService.getPublishedPosts(6); // Limit to 6 posts for homepage
      this.posts.set(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      this.loading.set(false);
    }
  }
  
  async loadFeaturedPosts() {
    try {
      const featured = await this.blogService.getFeaturedPosts(3); // Limit to 3 featured posts
      this.featuredPosts.set(featured);
    } catch (error) {
      console.error('Error loading featured posts:', error);
    }
  }
  
  formatDate(timestamp: any): string {
    if (!timestamp) {
      return '';
    }
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    });
  }
  
  generateExcerpt(post: BlogPost): string {
    if (post.excerpt) {
      return post.excerpt;
    }
    
    // Strip HTML tags and get first 150 characters
    const plainText = post.content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }
}