// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login.component';
import { SignupComponent } from './core/auth/signup.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { CreatePostComponent } from './features/blog/create-post.component';

export const routes: Routes = [
  { 
    path: 'auth', 
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'blog',
    canActivate: [authGuard],
    children: [
      { path: 'create', component: CreatePostComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [authGuard]
  }
];