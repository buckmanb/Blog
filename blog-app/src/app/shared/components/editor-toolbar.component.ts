// src/app/shared/components/editor-toolbar.component.ts
import { Component, Input, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from 'ngx-editor';
import { isNodeActive } from 'ngx-editor/helpers';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { EditorImageDialogComponent, EditorImageResult } from './editor-image-dialog.component';
import { CodeBlockDialogComponent, CodeBlockResult } from './code-block-dialog.component';

import { setBlockType } from 'prosemirror-commands';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

@Component({
  selector: 'app-editor-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    EditorImageDialogComponent    
  ],
  template: `
    <div class="editor-toolbar">
      <div class="toolbar-group">
        <button mat-icon-button matTooltip="Bold" (click)="this.editor.commands.toggleBold().exec()">
          <mat-icon>format_bold</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Italic" (click)="this.editor.commands.toggleItalics().exec()">
          <mat-icon>format_italic</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Underline" (click)="this.editor.commands.toggleUnderline().exec()">
          <mat-icon>format_underlined</mat-icon>
        </button>
      </div>
      
      <mat-divider [vertical]="true"></mat-divider>
      
      <div class="toolbar-group">
        <button mat-icon-button matTooltip="Heading 1" (click)="this.editor.commands.toggleHeading(1).exec()">
          <mat-icon>looks_one</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Heading 2" (click)="this.editor.commands.toggleHeading(2).exec()">
          <mat-icon>looks_two</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Heading 3" (click)="this.editor.commands.toggleHeading(3).exec()">
          <mat-icon>looks_3</mat-icon>
        </button>
      </div>
      
      <mat-divider [vertical]="true"></mat-divider>
      
      <div class="toolbar-group">
        <button mat-icon-button matTooltip="Bullet List" (click)="this.editor.commands.toggleBulletList().exec()">
          <mat-icon>format_list_bulleted</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Numbered List" (click)="this.editor.commands.toggleOrderedList().exec()">
          <mat-icon>format_list_numbered</mat-icon>
        </button>
      </div>
      
      <mat-divider [vertical]="true"></mat-divider>
      
      <div class="toolbar-group">
        <button mat-icon-button matTooltip="Link" (click)="insertLink()">
          <mat-icon>link</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Image" (click)="OnInsertImage()">
          <mat-icon>image</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Code Block" (click)="onInsertCodeBlock()">
          <mat-icon>code</mat-icon>
        </button>
      </div>
      
      <mat-divider [vertical]="true"></mat-divider>
      
      <div class="toolbar-group">
        <button mat-icon-button matTooltip="Align Left" (click)="setTextAlign('left')">
          <mat-icon>format_align_left</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Align Center" (click)="setTextAlign('center')">
          <mat-icon>format_align_center</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Align Right" (click)="setTextAlign('right')">
          <mat-icon>format_align_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .editor-toolbar {
      display: flex;
      align-items: center;
      padding: 8px;
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .toolbar-group {
      display: flex;
      align-items: center;
    }
    
    mat-divider {
      height: 24px;
      margin: 0 4px;
    }
    
    @media (max-width: 600px) {
      .editor-toolbar {
        justify-content: center;
      }
    }
  `]
})
export class EditorToolbarComponent implements OnInit {
  @Input() editor!: Editor;
  
  constructor(private dialog: MatDialog) {
  }

  isActive = false;
  isDisabled = false;

  onClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.execute(state, dispatch);
  }

  execute(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const { schema } = state;

    if (this.isActive) {
      // return setBlockType(schema.nodes.['paragraph'])(state, dispatch);
    }

    // return setBlockType(schema.nodes.code_mirror)(state, dispatch);
    return true;
  }

  
  ngOnInit(): void {
    const plugin = new Plugin({
      key: new PluginKey(`custom-menu-codemirror`),
      view: () => {
        return {
          // update: this.update,
        };
      },
    });

    this.editor.registerPlugin(plugin);
  }  
  OnInsertImage()
  {


    const dialogRef = this.dialog.open(EditorImageDialogComponent, {
      width: '600px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe((result: EditorImageResult | undefined) => {
      if (result) {
        this.editor.commands.insertImage(result.src, {
          alt: result.alt,
          // Include other attributes as needed
          title: result.title,
        }).exec();
      }      
    })
  }
  

  insertLink() {
    const url = prompt('Enter URL');
    if (url) {

      this.editor.commands.insertLink(url, { 
                 href: url,
                target: '_blank',
                }
      ).exec();              
    }
  }
   
  setTextAlign(align: 'left' | 'center' | 'right') {
    // This is a simplified version - might need custom extension
    document.execCommand('justifyLeft', false, '');
    document.execCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`, false, '');
  }

  onInsertCodeBlock() {

    const dialogRef = this.dialog.open(CodeBlockDialogComponent, {
      width: '700px',
      maxWidth: '95vw'
    });
    
    dialogRef.afterClosed().subscribe((result: CodeBlockResult | undefined) => {
      if (result) {
        // Create custom HTML for the code block with language
        const codeBlock = `
          <pre><code class="language-${result.language}">${this.escapeHtml(result.code)}</code></pre>
        `;
        
        // Insert as HTML - this may require custom extension
        this.editor.commands.insertHTML(codeBlock).exec();
      }
    });
  }
  
  // Helper method to escape HTML special characters
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

}