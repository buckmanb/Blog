import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard.component')
      .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'posts',
    loadComponent: () => import('./admin-posts.component')
      .then(m => m.AdminPostsComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./admin-users.component')
      .then(m => m.AdminUsersComponent)
  },
  {
    path: 'moderation',
    loadComponent: () => import('./admin-moderation.component')
      .then(m => m.AdminModerationComponent)
  },
  {
    path: 'comments',
    loadComponent: () => import('./admin-moderation.component')
      .then(m => m.AdminModerationComponent)
  }
];