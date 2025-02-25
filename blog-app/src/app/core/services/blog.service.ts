// src/app/core/services/blog.service.ts
import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as limitQuery, // Renamed to avoid naming conflicts
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  startAfter
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable, from, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId?: string;
  authorName?: string;
  authorPhotoURL?: string;
  status: 'draft' | 'published';
  featured?: boolean;
  tags: string[];
  imageUrl?: string;
  image?: {
    publicId: string;
    url: string;
    width: number;
    height: number;
  };
  likes?: number;
  views?: number;
  createdAt?: any;
  updatedAt?: any;
  publishedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  /**
   * Create a new blog post
   */
  async createPost(post: Partial<BlogPost>): Promise<string> {
    const user = this.authService.currentUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a post');
    }
    
    // Get the current user profile
    const profile = this.authService.profile();
    
    if (!profile) {
      throw new Error('User profile not found');
    }
    
    try {
      const postCollection = collection(this.firestore, 'posts');
      
      // Prepare the post data with author information
      const newPost: Partial<BlogPost> = {
        ...post,
        authorId: user.uid,
        authorName: profile.displayName || user.displayName || 'Anonymous',
        authorPhotoURL: profile.photoURL || user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: post.status === 'published' ? serverTimestamp() : null,
        likes: 0,
        views: 0
      };
      
      console.log('Creating new post with data:', JSON.stringify(newPost, null, 2));
      
      const docRef = await addDoc(postCollection, newPost);
      console.log('Post created with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Update an existing blog post
   */
  async updatePost(postId: string, updates: Partial<BlogPost>): Promise<void> {
    const user = this.authService.currentUser();
    
    if (!user) {
      throw new Error('You must be logged in to update a post');
    }
    
    try {
      // First check if the user is the author of the post
      const postRef = doc(this.firestore, 'posts', postId);
      
      // Prepare the update data
      const updateData: Partial<BlogPost> = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      
      // If the status is changing to published, set the publishedAt timestamp
      if (updates.status === 'published') {
        updateData.publishedAt = serverTimestamp();
      }
      
      await updateDoc(postRef, updateData);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Get all published posts
   */
  async getPublishedPosts(limitCount = 10): Promise<BlogPost[]> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      const q = query(
        postsCollection, 
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limitQuery(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          ...data
        } as BlogPost;
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  /**
   * Get posts for the current user
   */
  async getUserPosts(): Promise<BlogPost[]> {
    const user = this.authService.currentUser();
    
    if (!user) {
      throw new Error('You must be logged in to view your posts');
    }
    
    try {
      const postsCollection = collection(this.firestore, 'posts');
      const q = query(
        postsCollection, 
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          ...data
        } as BlogPost;
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  }

  /**
   * Get a single post by ID with optimized loading
   */
  async getPostById(postId: string): Promise<BlogPost | null> {
    try {
      const postRef = doc(this.firestore, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        return null;
      }
      
      // Get the post data
      const post = { id: postSnap.id, ...postSnap.data() } as BlogPost;
      
      // Increment view count asynchronously (don't wait for it)
      this.incrementViewCount(postId).catch(err => 
        console.error('Error incrementing view count:', err)
      );
      
      return post;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag: string, limitCount = 10): Promise<BlogPost[]> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      const q = query(
        postsCollection,
        where('status', '==', 'published'),
        where('tags', 'array-contains', tag),
        orderBy('publishedAt', 'desc'),
        limitQuery(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as BlogPost;
      });
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      throw error;
    }
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(limitCount = 5): Promise<BlogPost[]> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      const q = query(
        postsCollection,
        where('status', '==', 'published'),
        where('featured', '==', true),
        orderBy('publishedAt', 'desc'),
        limitQuery(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as BlogPost;
      });
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
  }

  /**
   * Get filtered posts with pagination
   */
  async getFilteredPosts(options: {
    tag?: string;
    search?: string;
    authorId?: string;
    status?: 'published' | 'draft';
    sort?: 'latest' | 'oldest' | 'popular';
    startAfter?: any;
    limit?: number;
  }): Promise<{ posts: BlogPost[]; hasMore: boolean }> {
    try {
      const {
        tag,
        search,
        authorId,
        status = 'published',
        sort = 'latest',
        startAfter,
        limit = 10
      } = options;
      
      // Start building the query
      let postsQuery = collection(this.firestore, 'posts');
      let constraints: QueryConstraint[] = [
        where('status', '==', status)
      ];
      
      // Add author filter if specified
      if (authorId) {
        constraints.push(where('authorId', '==', authorId));
      }
      
      // Add tag filter if specified
      if (tag) {
        constraints.push(where('tags', 'array-contains', tag));
      }
      
      // Add sorting
      switch (sort) {
        case 'latest':
          constraints.push(orderBy('publishedAt', 'desc'));
          break;
        case 'oldest':
          constraints.push(orderBy('publishedAt', 'asc'));
          break;
        case 'popular':
          constraints.push(orderBy('views', 'desc'));
          break;
      }
      
      // Add pagination if startAfter is provided
      if (startAfter) {
        constraints.push(startAfter(startAfter));
      }
      
      // Add limit to query (using limitCount to avoid name collision)
      const limitCount = limit + 1; // Get one extra to check if there are more
      constraints.push(limitQuery(limitCount));
      
      // Create the query
      const q = query(postsQuery, ...constraints);
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Check if there are more results
      const hasMore = querySnapshot.docs.length > limit;
      
      // Convert the query snapshot to posts
      const posts = querySnapshot.docs
        .slice(0, limit) // Remove the extra document we fetched to check for more
        .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      
      // If search is specified, filter the results client-side
      // Note: In a real app, you might want to use a search service like Algolia for this
      let filteredPosts = posts;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
        );
      }
      
      return { posts: filteredPosts, hasMore };
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
      throw error;
    }
  }

  /**
   * Get all unique tags used in posts
   */
  async getAvailableTags(): Promise<string[]> {
    try {
      // This would be more efficient with a dedicated tags collection
      // For now, we'll fetch all published posts and extract tags
      const postsRef = collection(this.firestore, 'posts');
      const q = query(
        postsRef,
        where('status', '==', 'published'),
        limitQuery(100) // Limit to a reasonable number
      );
      
      const querySnapshot = await getDocs(q);
      
      // Extract tags from all posts and create a unique set
      const tagSet = new Set<string>();
      querySnapshot.docs.forEach(doc => {
        const post = doc.data() as BlogPost;
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => tagSet.add(tag));
        }
      });
      
      // Convert set to array and sort alphabetically
      return Array.from(tagSet).sort();
    } catch (error) {
      console.error('Error fetching available tags:', error);
      throw error;
    }
  }

  /**
   * Get related posts based on tags
   */
  async getRelatedPosts(postId: string, tags: string[], maxLimit: number = 3): Promise<BlogPost[]> {
    try {
      if (!tags.length) return [];
      
      const postsRef = collection(this.firestore, 'posts');
      const q = query(
        postsRef,
        where('status', '==', 'published'),
        where('tags', 'array-contains-any', tags),
        where('__name__', '!=', postId), // Exclude the current post
        orderBy('__name__'), // Need to order by ID for the != filter to work
        orderBy('publishedAt', 'desc'),
        limitQuery(maxLimit)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error) {
      console.error('Error fetching related posts:', error);
      throw error;
    }
  }

  /**
   * Search posts by title or content
   */
  async searchPosts(searchTerm: string, maxResults: number = 10): Promise<BlogPost[]> {
    try {
      // Note: This is a simple implementation that won't scale well
      // For production, consider using a dedicated search service like Algolia
      const postsRef = collection(this.firestore, 'posts');
      const q = query(
        postsRef,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limitQuery(100) // Fetch a larger set to filter client-side
      );
      
      const querySnapshot = await getDocs(q);
      
      const searchLower = searchTerm.toLowerCase();
      
      // Filter posts that match the search term
      const matchingPosts = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
        .filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
        )
        .slice(0, maxResults);
      
      return matchingPosts;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  /**
   * Like a post
   */
  async likePost(postId: string): Promise<void> {
    const user = this.authService.currentUser();
    
    if (!user) {
      throw new Error('You must be logged in to like a post');
    }
    
    try {
      // In a real implementation, you'd need to check if the user has already liked the post
      // and maintain a collection of likes per post
      
      const postRef = doc(this.firestore, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnap.data() as BlogPost;
      const currentLikes = post.likes || 0;
      
      await updateDoc(postRef, {
        likes: currentLikes + 1
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  /**
   * Increment view count for a post
   */
  async incrementViewCount(postId: string): Promise<void> {
    try {
      const postRef = doc(this.firestore, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnap.data() as BlogPost;
      const currentViews = post.views || 0;
      
      await updateDoc(postRef, {
        views: currentViews + 1
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw this error as it's not critical
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    const user = this.authService.currentUser();
    
    if (!user) {
      throw new Error('You must be logged in to delete a post');
    }
    
    try {
      const postRef = doc(this.firestore, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnap.data() as BlogPost;
      
      // Check if user is author or admin
      const profile = this.authService.profile();
      if (post.authorId !== user.uid && profile?.role !== 'admin') {
        throw new Error('You do not have permission to delete this post');
      }
      
      // For now we'll just update the post to be flagged as deleted
      // In a real implementation, you might want to move it to a deleted collection
      await updateDoc(postRef, {
        status: 'deleted',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}