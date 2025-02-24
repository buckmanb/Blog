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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { BlogService } from '../../core/services/blog.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxEditorModule
  ],
  template: `
    <div class="container p-4">
      <mat-card class="max-w-4xl mx-auto">
        <mat-card-header>
          <mat-card-title>Create New Post</mat-card-title>
        </mat-card-header>
        
        <mat-card-content class="p-4">
          <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter post title">
              <mat-error *ngIf="postForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Content</mat-label>
              <ngx-editor
                [editor]="editor"
                formControlName="content"
                [placeholder]="'Write your post content here...'"
              ></ngx-editor>
              <mat-error *ngIf="postForm.get('content')?.hasError('required')">
                Content is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tags</mat-label>
              <mat-chip-grid #chipGrid aria-label="Tag selection">
                @for (tag of tags(); track tag) {
                  <mat-chip-row
                    (removed)="removeTag(tag)">
                    {{tag}}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                }
              </mat-chip-grid>
              <input placeholder="Add tags..."
                     [matChipInputFor]="chipGrid"
                     [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                     (matChipInputTokenEnd)="addTag($event)">
            </mat-form-field>

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

    ngx-editor {
      height: 400px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }
  `]
})
export class CreatePostComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  
  editor!: Editor;
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = signal<string[]>([]);
  saving = signal<boolean>(false);

  postForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    tags: [[]]
  });

  ngOnInit() {
    const menuItems = [
      ['bold', 'italic', 'underline'],
      ['ordered_list', 'bullet_list'],
      ['blockquote'],
      ['link'],
      ['code']
    ];

    this.editor = new Editor();
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

  async saveDraft() {
    if (this.postForm.valid) {
      try {
        this.saving.set(true);
        const formData = this.postForm.getRawValue();
        await this.blogService.createPost({
          title: formData.title || '',
          content: formData.content || '',
          tags: this.tags(),
          status: 'draft'
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
          status: 'published'
        });
      } finally {
        this.saving.set(false);
      }
    }
  }
}