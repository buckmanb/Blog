// src/app/features/blog/comments/comment-form.component.ts
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommentService, Comment } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <form [formGroup]="commentForm" (ngSubmit)="onSubmit()" class="comment-form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ isEditing ? 'Edit your comment' : 'Write a comment' }}</mat-label>
        <textarea 
          matInput 
          formControlName="content" 
          rows="3" 
          [placeholder]="isEditing ? 'Edit your comment' : 'Join the discussion...'"
          cdkTextareaAutosize>
        </textarea>
        <mat-error *ngIf="commentForm.get('content')?.hasError('required')">
          Comment content is required
        </mat-error>
        <mat-error *ngIf="commentForm.get('content')?.hasError('maxlength')">
          Comment cannot exceed 1000 characters
        </mat-error>
      </mat-form-field>
      
      <div class="form-actions">
        <button 
          *ngIf="isEditing" 
          type="button" 
          mat-button 
          (click)="onCancel()"
          [disabled]="submitting()">
          Cancel
        </button>
        
        <button 
          type="submit" 
          mat-raised-button 
          color="primary"
          [disabled]="commentForm.invalid || submitting()">
          <span *ngIf="!submitting()">{{ isEditing ? 'Update' : 'Post Comment' }}</span>
          <mat-spinner *ngIf="submitting()" diameter="20"></mat-spinner>
        </button>
      </div>
    </form>
  `,
  styles: [`
    .comment-form {
      display: flex;
      flex-direction: column;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    
    button[type="submit"] {
      min-width: 120px;
      position: relative;
    }
    
    mat-spinner {
      margin: 0 auto;
    }
  `]
})
export class CommentFormComponent {
  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  
  @Input() postId!: string;
  @Input() parentId?: string;
  @Input() commentId?: string;
  @Input() initialContent: string = '';
  @Input() isEditing: boolean = false;
  
  @Output() commentAdded = new EventEmitter<Comment>();
  @Output() commentUpdated = new EventEmitter<Comment>();
  @Output() cancelEdit = new EventEmitter<void>();
  
  submitting = signal<boolean>(false);
  
  commentForm = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(1000)]]
  });
  
  ngOnInit() {
    if (this.initialContent) {
      this.commentForm.patchValue({ content: this.initialContent });
    }
  }
  
  async onSubmit() {
    if (this.commentForm.invalid) return;
    
    const content = this.commentForm.get('content')?.value || '';
    
    this.submitting.set(true);
    
    try {
      if (this.isEditing && this.commentId) {
        // Update existing comment
        await this.commentService.updateComment(this.commentId, { content });
        
        // Construct updated comment object
        const user = this.authService.currentUser();
        const profile = this.authService.profile();
        
        if (!user || !profile) throw new Error('User not found');
        
        const updatedComment: Comment = {
          id: this.commentId,
          postId: this.postId,
          content,
          authorId: user.uid,
          authorName: profile.displayName,
          authorPhotoURL: profile.photoURL,
          status: 'approved', // Assuming edits are auto-approved
          updatedAt: new Date()
        };
        
        this.commentUpdated.emit(updatedComment);
      } else {
        // Add new comment
        const user = this.authService.currentUser();
        const profile = this.authService.profile();
        
        if (!user || !profile) throw new Error('User not found');
        
        const newComment: Partial<Comment> = {
          postId: this.postId,
          content,
          authorId: user.uid,
          authorName: profile.displayName,
          authorPhotoURL: profile.photoURL,
          status: profile.role === 'admin' || profile.role === 'author' ? 'approved' : 'pending',
          parentId: this.parentId
        };
        
        const commentId = await this.commentService.addComment(newComment);
        
        // For the UI, we'll create a complete comment object
        const addedComment: Comment = {
          ...newComment,
          id: commentId,
          createdAt: new Date(),
          likes: 0
        } as Comment;
        
        this.commentAdded.emit(addedComment);
        this.commentForm.reset();
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      // TODO: Show error message to user
    } finally {
      this.submitting.set(false);
    }
  }
  
  onCancel() {
    this.cancelEdit.emit();
  }
}