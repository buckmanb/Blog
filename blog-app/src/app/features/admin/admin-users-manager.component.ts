// src/app/features/admin/admin-users-manager.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, UserProfile } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-users-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="users-manager-container">
      <div class="page-header">
        <h1>User Management</h1>
        
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search users</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or email">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          
          <button mat-raised-button color="primary" (click)="inviteUser()">
            <mat-icon>person_add</mat-icon>
            Invite User
          </button>
        </div>
      </div>
      
      <div class="users-table-container mat-elevation-z2">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- Avatar Column -->
          <ng-container matColumnDef="avatar">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let user">
              <div class="user-avatar">
                <img *ngIf="user.photoURL" [src]="user.photoURL" [alt]="user.displayName">
                <mat-icon *ngIf="!user.photoURL">account_circle</mat-icon>
              </div>
            </td>
          </ng-container>
          
          <!-- Display Name Column -->
          <ng-container matColumnDef="displayName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
            <td mat-cell *matCellDef="let user">
              {{ user.displayName }}
            </td>
          </ng-container>
          
          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>
          
          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
            <td mat-cell *matCellDef="let user">
              <mat-form-field appearance="outline" class="role-select">
                <mat-select [(value)]="user.role" (selectionChange)="updateUserRole(user.uid, $event.value)">
                  <mat-option value="user">User</mat-option>
                  <mat-option value="author">Author</mat-option>
                  <mat-option value="admin">Admin</mat-option>
                </mat-select>
              </mat-form-field>
            </td>
          </ng-container>
          
          <!-- Created Date Column -->
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Joined</th>
            <td mat-cell *matCellDef="let user">
              {{ user.createdAt ? (user.createdAt.toDate() | date:'mediumDate') : 'N/A' }}
            </td>
          </ng-container>
          
          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button [matMenuTriggerFor]="userMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              
              <mat-menu #userMenu="matMenu">
                <button mat-menu-item (click)="viewUserDetails(user)">
                  <mat-icon>visibility</mat-icon>
                  <span>View Details</span>
                </button>
                <button mat-menu-item (click)="viewUserPosts(user)">
                  <mat-icon>description</mat-icon>
                  <span>View Posts</span>
                </button>
                <button mat-menu-item (click)="resetUserPassword(user)">
                  <mat-icon>lock_reset</mat-icon>
                  <span>Reset Password</span>
                </button>
                <button mat-menu-item (click)="deactivateUser(user)" *ngIf="user.uid !== currentUserUid()">
                  <mat-icon color="warn">block</mat-icon>
                  <span>Deactivate Account</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          
          <!-- Row shown when no matching data -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="6">No users found matching the filter.</td>
          </tr>
        </table>
        
        <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .users-manager-container {
      padding: 24px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .search-field {
      width: 300px;
    }
    
    .users-table-container {
      position: relative;
      min-height: 400px;
      overflow: auto;
    }
    
    table {
      width: 100%;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .role-select {
      width: 100px;
    }
    
    .mat-column-avatar {
      width: 60px;
      text-align: center;
    }
    
    .mat-column-actions {
      width: 60px;
      text-align: right;
    }
  `]
})
export class AdminUsersManagerComponent implements OnInit {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  // TODO: Replace this with a real data source
  dataSource: any = [];
  displayedColumns: string[] = ['avatar', 'displayName', 'email', 'role', 'createdAt', 'actions'];
  
  currentUserUid = signal<string>('');
  
  ngOnInit() {
    // Get current user for comparison (can't deactivate yourself)
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.currentUserUid.set(currentUser.uid);
    }
    
    // TODO: Load users
    this.loadUsers();
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // TODO: Implement filtering
    console.log('Filter value:', filterValue);
  }
  
  loadUsers() {
    // TODO: Implement loading users
    console.log('Loading users...');
  }
  
  updateUserRole(uid: string, role: 'admin' | 'author' | 'user') {
    // TODO: Implement updating user role
    console.log('Updating user role:', uid, role);
  }
  
  inviteUser() {
    // TODO: Implement inviting a user
    console.log('Inviting user...');
  }
  
  viewUserDetails(user: UserProfile) {
    // TODO: Implement viewing user details
    console.log('Viewing user details:', user);
  }
  
  viewUserPosts(user: UserProfile) {
    // TODO: Implement viewing user posts
    console.log('Viewing user posts:', user);
  }
  
  resetUserPassword(user: UserProfile) {
    // TODO: Implement resetting user password
    console.log('Resetting user password:', user);
  }
  
  deactivateUser(user: UserProfile) {
    // TODO: Implement deactivating a user
    console.log('Deactivating user:', user);
  }
}