// src/app/features/blog/blog-post-editor.component.ts
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Editor, NgxEditorModule  } from 'ngx-editor';
import { CloudinaryUploadResult } from '../../core/services/cloudinary.service';
import { ImageUploadComponent } from '../../shared/components/image-upload.component';
import { CodeHighlightDirective } from '../../shared/directives/code-highlight.directive';
import { BlogPost, BlogService } from '../../core/services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-post-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    NgxEditorModule,
    ImageUploadComponent,
    CodeHighlightDirective
  ],
  template: `
    <div class="editor-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Post' : 'Create New Post' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="postForm" class="post-form">
            <!-- Title field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter post title">
              <mat-error *ngIf="postForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
            
            <!-- Excerpt/summary field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Excerpt</mat-label>
              <textarea 
                matInput 
                formControlName="excerpt" 
                placeholder="Brief summary of your post (optional)"
                rows="2">
              </textarea>
              <mat-hint align="end">{{ postForm.get('excerpt')?.value?.length || 0 }}/200</mat-hint>
            </mat-form-field>
            
            <!-- Featured image -->
            <div class="image-section">
              <h3>Featured Image</h3>
              <app-image-upload 
                [initialImageUrl]="currentPost?.imageUrl || ''"
                (imageUploaded)="onImageUploaded($event)"
                (imageRemoved)="onImageRemoved()">
              </app-image-upload>
            </div>
            
            <!-- Content editor -->
            <div class="editor-section">
              <h3>Content</h3>
              <ngx-editor
                [editor]="editor"
                formControlName="content"
                [placeholder]="'Write your post content here...'"
                >
              </ngx-editor>
              <mat-error *ngIf="postForm.get('content')?.hasError('required') && postForm.get('content')?.touched">
                Content is required
              </mat-error>
            </div>
            
            <!-- Tags -->
            <div class="tags-section">
              <h3>Tags</h3>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Tags</mat-label>
                <mat-chip-grid #chipGrid aria-label="Tag selection">
                  <mat-chip-row 
                    *ngFor="let tag of tags" 
                    (removed)="removeTag(tag)"
                    [editable]="true"
                    (edited)="editTag(tag, $event)">
                    {{tag}}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                </mat-chip-grid>
                <input 
                  placeholder="New tag..."
                  [matChipInputFor]="chipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  [matChipInputAddOnBlur]="true"
                  (matChipInputTokenEnd)="addTag($event)">
                <mat-hint>Press Enter or comma to add a tag</mat-hint>
              </mat-form-field>
            </div>
            
            <!-- Featured checkbox -->
            <div class="featured-section">
              <mat-checkbox formControlName="featured">
                Feature this post on the homepage
              </mat-checkbox>
            </div>
            
            <!-- Action buttons -->
            <div class="action-buttons">
              <button 
                mat-button 
                type="button" 
                (click)="cancel()" 
                [disabled]="saving">
                Cancel
              </button>
              
              <button 
                mat-stroked-button 
                type="button" 
                (click)="saveDraft()" 
                [disabled]="saving || !postForm.valid">
                <mat-icon *ngIf="!saving">save</mat-icon>
                <mat-spinner *ngIf="saving && saveAsDraft" diameter="24"></mat-spinner>
                Save as Draft
              </button>
              
              <button 
                mat-raised-button 
                color="primary" 
                type="button" 
                (click)="publishPost()" 
                [disabled]="saving || !postForm.valid">
                <mat-icon *ngIf="!saving">publish</mat-icon>
                <mat-spinner *ngIf="saving && !saveAsDraft" diameter="24" color="accent"></mat-spinner>
                {{ isEditMode ? 'Update' : 'Publish' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .editor-container {
      max-width: 1000px;
      margin: 0 auto 32px;
      padding: 0 16px;
    }
    
    .post-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .editor-section {
      margin-bottom: 16px;
    }
    
    .image-section, .tags-section, .featured-section {
      margin-bottom: 16px;
    }
    
    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
    }
    
    h3 {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text-primary);
    }
    
    ::ng-deep .NgxEditor {
      min-height: 400px;
    }
    
    ::ng-deep .NgxEditor__Content {
      min-height: 350px;
    }
    
    button mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class BlogPostEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  editor: Editor = new Editor();
  postForm = this.fb.group({
    title: ['', Validators.required],
    excerpt: ['', Validators.maxLength(200)],
    content: ['', Validators.required],
    featured: [false]
  });
  
  tags: string[] = [];
  featuredImage?: CloudinaryUploadResult;
  
  saving = false;
  saveAsDraft = true;
  isEditMode = false;
  currentPost?: BlogPost;
  postId?: string;
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  
  ngOnInit() {
    // Initialize the editor
    this.editor = new Editor({
      history: true,
      keyboardShortcuts: true
    });
    
    // Check if we're in edit mode by looking for an ID parameter
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.postId = id;
        this.loadExistingPost(id);
      }
    });
  }
  
  ngOnDestroy() {
    this.editor.destroy();
  }
  
  /**
   * Load existing post data when in edit mode
   */
  async loadExistingPost(postId: string) {
    try {
      const post = await this.blogService.getPostById(postId);
      
      if (post) {
        this.currentPost = post;
        
        // Populate the form with existing post data
        this.postForm.patchValue({
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content,
          featured: post.featured || false
        });
        
        this.tags = [...(post.tags || [])];
      } else {
        this.snackBar.open('Post not found', 'Close', { duration: 3000 });
        this.router.navigate(['/blog']);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      this.snackBar.open('Error loading post', 'Close', { duration: 3000 });
    }
  }
  
  onImageUploaded(result: CloudinaryUploadResult) {
    this.featuredImage = result;
  }
  
  onImageRemoved() {
    this.featuredImage = undefined;
  }
  
  addTag(event: any) {
    const value = (event.value || '').trim();
    
    if (value) {
      // Check if tag already exists
      if (!this.tags.includes(value)) {
        this.tags.push(value);
      }
    }
    
    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }
  }
  
  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  
  editTag(tag: string, event: any) {
    const newTag = event.value.trim();
    
    // Replace old tag with edited tag
    if (newTag && !this.tags.includes(newTag)) {
      const index = this.tags.indexOf(tag);
      if (index >= 0) {
        this.tags[index] = newTag;
      }
    }
  }
  
  saveDraft() {
    this.saveAsDraft = true;
    this.savePost('draft');
  }
  
  publishPost() {
    this.saveAsDraft = false;
    this.savePost('published');
  }
  
  async savePost(status: 'draft' | 'published') {
    if (this.postForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      // Mark all fields as touched to show validation errors
      this.postForm.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    
    const formData = this.postForm.getRawValue();
    
    const post: Partial<BlogPost> = {
      title: formData.title!,
      content: formData.content!,
      excerpt: formData.excerpt || undefined,
      featured: formData.featured || false,
      tags: this.tags,
      status: status,
      imageUrl: this.featuredImage?.secure_url || this.currentPost?.imageUrl,
    };
    
    // Add image data if available
    if (this.featuredImage) {
      post.image = {
        publicId: this.featuredImage.public_id,
        url: this.featuredImage.secure_url,
        width: this.featuredImage.width,
        height: this.featuredImage.height
      };
    }
    
    try {
      if (this.isEditMode && this.postId) {
        // Update existing post
        await this.blogService.updatePost(this.postId, post);
        this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
        
        // Navigate to the post detail page
        this.router.navigate(['/blog', this.postId]);
      } else {
        // Create new post
        const newPostId = await this.blogService.createPost(post);
        
        if (status === 'published') {
          this.snackBar.open('Post published successfully', 'Close', { duration: 3000 });
          // Navigate to the new post
          this.router.navigate(['/blog', newPostId]);
        } else {
          this.snackBar.open('Draft saved successfully', 'Close', { duration: 3000 });
          // Navigate to user's posts list
          this.router.navigate(['/user/posts']);
        }
      }
    } catch (error) {
      console.error('Error saving post:', error);
      this.snackBar.open('Error saving post', 'Close', { duration: 3000 });
    } finally {
      this.saving = false;
    }
  }
  
  cancel() {
    if (this.isEditMode && this.postId) {
      // Navigate back to post detail page
      this.router.navigate(['/blog', this.postId]);
    } else {
      // Navigate back to posts list
      this.router.navigate(['/blog']);
    }
  }
}