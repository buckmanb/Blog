// src/app/features/blog/comments/comment-list.component.ts
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommentService, Comment } from '../../../core/services/comment.service';
import { CommentItemComponent } from './comment-item.component';
import { CommentFormComponent } from './comment-form.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CommentItemComponent,
    CommentFormComponent
  ],
  template: `
    <div class="comments-container">
      <h2 class="comments-header">
        Comments ({{ comments().length }})
      </h2>
      
      <!-- Comment form for logged in users -->
      <div class="comment-form-wrapper" *ngIf="isLoggedIn()">
        <app-comment-form 
          [postId]="postId" 
          (commentAdded)="onCommentAdded($event)">
        </app-comment-form>
      </div>
      
      <!-- Login prompt for users not logged in -->
      <div class="login-prompt" *ngIf="!isLoggedIn()">
        <p>Please <a routerLink="/auth/login">login</a> to leave a comment.</p>
      </div>
      
      <!-- Comments list -->
      <div class="comments-list">
        <ng-container *ngIf="comments().length > 0; else noComments">
          <app-comment-item 
            *ngFor="let comment of comments()" 
            [comment]="comment"
            [postId]="postId"
            (commentDeleted)="onCommentDeleted($event)"
            (commentUpdated)="onCommentUpdated($event)">
          </app-comment-item>
        </ng-container>
        
        <ng-template #noComments>
          <div class="no-comments-message">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        </ng-template>
      </div>
      
      <!-- Load more button if there are more comments -->
      <div class="load-more" *ngIf="hasMoreComments()">
        <button mat-button color="primary" (click)="loadMoreComments()">
          Load More Comments
        </button>
      </div>
    </div>
  `,
  styles: [`
    .comments-container {
      margin-top: 32px;
    }
    
    .comments-header {
      font-size: 1.5rem;
      margin-bottom: 16px;
    }
    
    .comment-form-wrapper {
      margin-bottom: 24px;
    }
    
    .login-prompt {
      padding: 16px;
      text-align: center;
      background-color: var(--surface-color);
      border-radius: 4px;
      margin-bottom: 24px;
    }
    
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .no-comments-message {
      padding: 24px;
      text-align: center;
      color: var(--text-secondary);
    }
    
    .load-more {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }
  `]
})
export class CommentListComponent implements OnInit {
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  
  @Input() postId!: string;
  
  comments = signal<Comment[]>([]);
  loading = signal<boolean>(false);
  isLoggedIn = signal<boolean>(false);
  hasMoreComments = signal<boolean>(false);
  
  ngOnInit() {
    // Check if user is logged in
    this.isLoggedIn.set(!!this.authService.currentUser());
    
    // Load initial comments
    this.loadComments();
  }
  
  async loadComments() {
    // TODO: Implement loading comments logic
    
    try {
      this.loading.set(true);
      const postComments = await this.commentService.getCommentsByPostId(this.postId);
      this.comments.set(postComments);
      
      // Check if there are potentially more comments to load
      this.hasMoreComments.set(postComments.length >= 10); // Assuming we load 10 at a time
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      this.loading.set(false);
    }
  }
  
  loadMoreComments() {
    // TODO: Implement loading more comments logic
  }
  
  onCommentAdded(comment: Comment) {
    // TODO: Implement adding a new comment to the list
    this.comments.update(comments => [comment, ...comments]);
  }
  
  onCommentDeleted(commentId: string) {
    // TODO: Implement removing a deleted comment from the list
    this.comments.update(comments => comments.filter(c => c.id !== commentId));
  }
  
  onCommentUpdated(updatedComment: Comment) {
    // TODO: Implement updating a comment in the list
    this.comments.update(comments => 
      comments.map(c => c.id === updatedComment.id ? updatedComment : c)
    );
  }
}