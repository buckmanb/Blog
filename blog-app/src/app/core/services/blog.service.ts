// src/app/core/services/blog.service.ts
import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc,
  updateDoc,
  doc,
  serverTimestamp 
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
  status: 'draft' | 'published';
  authorId: string;
  authorName: string;
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  async createPost(post: Partial<BlogPost>): Promise<string> {
    const user = this.authService.currentUser();
    if (!user) throw new Error('Must be logged in to create a post');

    const postCollection = collection(this.firestore, 'posts');
    
    const newPost: Partial<BlogPost> = {
      ...post,
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: post.status === 'published' ? serverTimestamp() : null
    };

    const docRef = await addDoc(postCollection, newPost);
    return docRef.id;
  }

  async updatePost(postId: string, updates: Partial<BlogPost>): Promise<void> {
    const postRef = doc(this.firestore, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      publishedAt: updates.status === 'published' ? serverTimestamp() : null
    });
  }

  // Add more methods for fetching posts, etc.
}