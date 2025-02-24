// src/app/core/firebase-test.component.ts
import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-firebase-test',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Firebase Connection Test</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Status: {{ status }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="testConnection()">Test Connection</button>
      </mat-card-actions>
    </mat-card>
  `
})
export class FirebaseTestComponent {
  status = 'Not tested';

  constructor(private firestore: Firestore) {}

  async testConnection() {
    try {
      this.status = 'Testing...';
      const testCollection = collection(this.firestore, 'test');
      await addDoc(testCollection, {
        timestamp: new Date(),
        test: true
      });
      this.status = 'Successfully connected to Firebase!';
    } catch (error) {
      console.error('Firebase error:', error);
      this.status = `Error: ${(error as any).message}`;
    }
  }
}