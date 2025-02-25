// src/app/shared/directives/code-highlight.directive.ts
import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

// This directive will use PrismJS for code syntax highlighting
// PrismJS needs to be added to the project via npm install prismjs

declare var Prism: any;

@Directive({
  selector: '[appCodeHighlight]',
  standalone: true
})
export class CodeHighlightDirective implements AfterViewInit, OnChanges {
  @Input() appCodeHighlight: string = ''; // Code language
  @Input() code: string = ''; // Code content
  
  constructor(private el: ElementRef) {}
  
  ngAfterViewInit() {
    this.highlightCode();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['code'] || changes['appCodeHighlight']) {
      // Wait for the next tick to make sure DOM is updated
      setTimeout(() => {
        this.highlightCode();
      }, 0);
    }
  }
  
  private highlightCode() {
    if (!this.code) {
      this.code = this.el.nativeElement.textContent || '';
    }
    
    // Set language class on the element
    const language = this.appCodeHighlight || 'typescript';
    this.el.nativeElement.className = `language-${language}`;
    
    // Set the code content
    this.el.nativeElement.textContent = this.code;
    
    // Apply Prism highlighting
    if (Prism) {
      Prism.highlightElement(this.el.nativeElement);
    } else {
      console.warn('Prism library not loaded. Code highlighting will not work.');
    }
  }
}