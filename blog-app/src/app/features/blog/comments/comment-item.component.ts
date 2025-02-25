// src/app/features/blog/comments/comment-item.component.ts
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommentService, Comment } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommentFormComponent } from './comment-form.component';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    CommentFormComponent
  ],
  template: `
    <mat-card class="comment-card">
      <div class="comment-header">
        <div class="author-info">
          <div class="author-avatar">
            <img *ngIf="comment.authorPhotoURL" [src]="comment.authorPhotoURL" alt="Author" />
            <mat-icon *ngIf="!comment.authorPhotoURL">account_circle</mat-icon>
          </div>
          <div class="author-details">
            <div class="author-name">{{ comment.authorName }}</div>
            <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>
          </div>
        </div>
        
        <!-- Comment actions menu for author or admin -->
        <button *ngIf="canModifyComment()" mat-icon-button [matMenuTriggerFor]="commentMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        
        <mat-menu #commentMenu="matMenu">
          <button mat-menu-item (click)="startEditing()">
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
          </button>
          <button mat-menu-item (click)="deleteComment()">
            <mat-icon color="warn">delete</mat-icon>
            <span>Delete</span>
          </button>
        </mat-menu>
      </div>
      
      <mat-card-content>
        <!-- Comment content - shown when not editing -->
        <div *ngIf="!isEditing()" class="comment-content">
          {{ comment.content }}
        </div>
        
        <!-- Comment edit form - shown when editing -->
        <div *ngIf="isEditing()" class="comment-edit-form">
          <app-comment-form 
            [initialContent]="comment.content" 
            [isEditing]="true"
            [postId]="postId"
            [commentId]="comment.id!"
            (commentUpdated)="onCommentUpdated($event)"
            (cancelEdit)="cancelEditing()">
          </app-comment-form>
        </div>
      </mat-card-content>
      
      <mat-card-actions>
        <button mat-button (click)="likeComment()">
          <mat-icon>{{ isLiked() ? 'favorite' : 'favorite_border' }}</mat-icon>
          {{ comment.likes || 0 }}
        </button>
        
        <button mat-button (click)="toggleReplyForm()">
          <mat-icon>reply</mat-icon>
          Reply
        </button>
        
        <!-- Moderation actions for admin -->
        <ng-container *ngIf="isAdmin()">
          <button *ngIf="comment.status !== 'approved'" mat-button color="primary" (click)="approveComment()">
            <mat-icon>check_circle</mat-icon>
            Approve
          </button>
          <button *ngIf="comment.status !== 'flagged'" mat-button color="warn" (click)="flagComment()">
            <mat-icon>flag</mat-icon>
            Flag
          </button>
        </ng-container>
      </mat-card-actions>
      
      <!-- Reply form -->
      <div *ngIf="showReplyForm()" class="reply-form">
        <app-comment-form 
          [postId]="postId" 
          [parentId]="comment.id!"
          (commentAdded)="onReplyAdded($event)"
          (cancelEdit)="toggleReplyForm()">
        </app-comment-form>
      </div>
      
      <!-- Replies section -->
      <div *ngIf="replies().length > 0" class="replies-section">
        <mat-divider></mat-divider>
        <div class="replies-container">
          <div *ngFor="let reply of replies()" class="reply-item">
            <!-- TODO: Implement nested comment component or recursively use this component -->
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .comment-card {
      margin-bottom: 16px;
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .author-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--surface-color);
    }
    
    .author-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .author-avatar mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--text-secondary);
    }
    
    .author-details {
      display: flex;
      flex-direction: column;
    }
    
    .author-name {
      font-weight: 500;
    }
    
    .comment-date {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    
    .comment-content {
      white-space: pre-wrap;
      margin-bottom: 8px;
    }
    
    .reply-form {
      margin-top: 16px;
      padding-left: 16px;
      border-left: 2px solid var(--primary-lighter);
    }
    
    .replies-section {
      margin-top: 16px;
    }
    
    .replies-container {
      padding-left: 16px;
      margin-top: 16px;
    }
    
    .reply-item {
      margin-bottom: 8px;
    }
  `]
})
export class CommentItemComponent {
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  
  @Input() comment!: Comment;
  @Input() postId!: string;
  
  @Output() commentDeleted = new EventEmitter<string>();
  @Output() commentUpdated = new EventEmitter<Comment>();
  @Output() replyAdded = new EventEmitter<Comment>();
  
  isEditing = signal<boolean>(false);
  showReplyForm = signal<boolean>(false);
  isLiked = signal<boolean>(false);
  replies = signal<Comment[]>([]);
  
  ngOnInit() {
    // Load replies if this comment has any
    this.loadReplies();
  }
  
  async loadReplies() {
    if (this.comment.id) {
      try {
        const replies = await this.commentService.getRepliesByCommentId(this.comment.id);
        this.replies.set(replies);
      } catch (error) {
        console.error('Error loading replies:', error);
      }
    }
  }
  
  canModifyComment(): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return false;
    
    const isAuthor = currentUser.uid === this.comment.authorId;
    const isAdmin = this.authService.profile()?.role === 'admin';
    
    return isAuthor || isAdmin;
  }
  
  isAdmin(): boolean {
    return this.authService.profile()?.role === 'admin';
  }
  
  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  startEditing() {
    this.isEditing.set(true);
  }
  
  cancelEditing() {
    this.isEditing.set(false);
  }
  
  toggleReplyForm() {
    this.showReplyForm.update(value => !value);
  }
  
  async deleteComment() {
    if (this.comment.id) {
      try {
        await this.commentService.deleteComment(this.comment.id);
        this.commentDeleted.emit(this.comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  }
  
  async likeComment() {
    if (this.comment.id) {
      try {
        await this.commentService.likeComment(this.comment.id);
        this.isLiked.update(value => !value);
        
        // Update local comment data
        const updatedLikes = (this.comment.likes || 0) + (this.isLiked() ? 1 : -1);
        this.comment = { ...this.comment, likes: updatedLikes };
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    }
  }
  
  async approveComment() {
    if (this.comment.id) {
      try {
        await this.commentService.moderateComment(this.comment.id, 'approved');
        this.comment = { ...this.comment, status: 'approved' };
        this.commentUpdated.emit(this.comment);
      } catch (error) {
        console.error('Error approving comment:', error);
      }
    }
  }
  
  async flagComment() {
    if (this.comment.id) {
      try {
        await this.commentService.moderateComment(this.comment.id, 'flagged');
        this.comment = { ...this.comment, status: 'flagged' };
        this.commentUpdated.emit(this.comment);
      } catch (error) {
        console.error('Error flagging comment:', error);
      }
    }
  }
  
  onCommentUpdated(updatedComment: Comment) {
    this.comment = updatedComment;
    this.commentUpdated.emit(updatedComment);
    this.isEditing.set(false);
  }
  
  onReplyAdded(reply: Comment) {
    this.replies.update(replies => [reply, ...replies]);
    this.replyAdded.emit(reply);
    this.showReplyForm.set(false);
  }
}