// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login.component';
import { SignupComponent } from './core/auth/signup.component';
import { HomeComponent } from './features/home/home.component';
import { CreatePostComponent } from './features/blog/create-post.component';
import { UserProfileComponent } from './features/user/profile.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { authorGuard } from './core/guards/author.guard';

export const routes: Routes = [
  // Auth routes
  { 
    path: 'auth', 
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  
  // Blog routes
  {
    path: 'blog',
    children: [
      { 
        path: 'create', 
        component: CreatePostComponent,
        canActivate: [authGuard, authorGuard]
      },
      { 
        path: ':id/edit', 
        component: CreatePostComponent,
        canActivate: [authGuard, authorGuard] 
      },
      { 
        path: ':id', 
        loadComponent: () => import('./features/blog/post-detail.component')
          .then(m => m.PostDetailComponent)
      },
      { 
        path: '', 
        loadComponent: () => import('./features/blog/post-list.component')
          .then(m => m.PostListComponent) 
      }
    ]
  },
  
  // User routes
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: UserProfileComponent },
      { 
        path: 'posts', 
        loadComponent: () => import('./features/user/user-posts.component')
          .then(m => m.UserPostsComponent) 
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  
  // Home route
  { path: '', component: HomeComponent },
  
  // Wildcard route
  { path: '**', redirectTo: '' }
];