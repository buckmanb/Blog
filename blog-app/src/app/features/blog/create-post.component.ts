// src/app/features/blog/create-post.component.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { BlogService } from '../../core/services/blog.service';
import { ImageUploadComponent } from '../../shared/components/image-upload.component';
import { CloudinaryUploadResult } from '../../core/services/cloudinary.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    NgxEditorModule,
    ImageUploadComponent
  ],
  template: `
    <div class="container p-4">
      <mat-card class="max-w-4xl mx-auto">
        <mat-card-header>
          <mat-card-title>Create New Post</mat-card-title>
        </mat-card-header>
        
        <mat-card-content class="p-4">
          <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <!-- Title field -->
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter post title">
              <mat-error *ngIf="postForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <!-- Image upload section -->
            <div class="image-upload-section">
              <h3 class="section-title">Featured Image</h3>
              <app-image-upload 
                (imageUploaded)="onImageUploaded($event)"
                (imageRemoved)="onImageRemoved()">
              </app-image-upload>
            </div>

            <!-- Content field -->
            <div class="editor-wrapper">
              <h3 class="section-title">Content</h3>
              <ngx-editor
                [editor]="editor"
                formControlName="content"
                [placeholder]="'Write your post content here...'">
              </ngx-editor>
              <div class="error-message" *ngIf="postForm.get('content')?.hasError('required') && postForm.get('content')?.touched">
                Content is required
              </div>
            </div>

            <!-- Tags field -->
            <mat-form-field appearance="outline">
              <mat-label>Tags</mat-label>
              <mat-chip-grid #chipGrid aria-label="Tag selection">
                @for (tag of tags(); track tag) {
                  <mat-chip-row (removed)="removeTag(tag)">
                    {{tag}}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                }
              </mat-chip-grid>
              <input matInput placeholder="Add tags..."
                     [matChipInputFor]="chipGrid"
                     [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                     (matChipInputTokenEnd)="addTag($event)">
            </mat-form-field>

            <!-- Action buttons -->
            <div class="flex gap-4 justify-end">
              <button mat-stroked-button
                      type="button"
                      [disabled]="saving()"
                      (click)="saveDraft()">
                Save as Draft
              </button>
              
              <button mat-raised-button
                      color="primary"
                      type="submit"
                      [disabled]="!postForm.valid || saving()">
                Publish Post
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      margin: 0 auto;
      max-width: 1200px;
    }

    .editor-wrapper {
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .image-upload-section {
      margin-bottom: 1.5rem;
    }

    ngx-editor {
      display: block;
      min-height: 400px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    .error-message {
      color: #f44336;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
  `]
})
export class CreatePostComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private snackBar = inject(MatSnackBar);
  
  editor = new Editor();
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = signal<string[]>([]);
  saving = signal<boolean>(false);
  featuredImage = signal<CloudinaryUploadResult | null>(null);

  postForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    tags: [[]]
  });

  ngOnInit() {
    // Initialize anything if needed
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  addTag(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.update(tags => [...tags, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tagToRemove: string) {
    this.tags.update(tags => tags.filter(tag => tag !== tagToRemove));
  }

  onImageUploaded(result: CloudinaryUploadResult) {
    this.featuredImage.set(result);
    this.snackBar.open('Image uploaded successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  onImageRemoved() {
    this.featuredImage.set(null);
  }

  async saveDraft() {
    if (this.postForm.valid) {
      try {
        this.saving.set(true);
        const formData = this.postForm.getRawValue();
        await this.blogService.createPost({
          title: formData.title || '',
          content: formData.content || '',
          tags: this.tags(),
          status: 'draft',
          imageUrl: this.featuredImage()?.secure_url || '',
          image: this.featuredImage() ? {
            publicId: this.featuredImage()!.public_id,
            url: this.featuredImage()!.secure_url,
            width: this.featuredImage()!.width,
            height: this.featuredImage()!.height
          } : undefined
        });
        
        this.snackBar.open('Draft saved successfully', 'Close', {
          duration: 3000
        });
      } finally {
        this.saving.set(false);
      }
    }
  }

  async onSubmit() {
    if (this.postForm.valid) {
      try {
        this.saving.set(true);
        const formData = this.postForm.getRawValue();
        await this.blogService.createPost({
          title: formData.title || '',
          content: formData.content || '',
          tags: this.tags(),
          status: 'published',
          imageUrl: this.featuredImage()?.secure_url || '',
          image: this.featuredImage() ? {
            publicId: this.featuredImage()!.public_id,
            url: this.featuredImage()!.secure_url,
            width: this.featuredImage()!.width,
            height: this.featuredImage()!.height
          } : undefined
        });
        
        this.snackBar.open('Post published successfully', 'Close', {
          duration: 3000
        });
      } finally {
        this.saving.set(false);
      }
    }
  }
}