Based on where we are now, here's our high-level todo list for the blog system:

1. **Complete Post Management**
   - Implement edit mode in the CreatePostComponent
   - Add code syntax highlighting to the rich text editor
   - Fix remaining issues with image upload via Cloudinary
   - Create a method in BlogService to get a single post by ID
   - Implement method to share posts to other social media sites with a unique URL

2. **Implement Blog Post List & Home Page**
   - Finalize the PostListComponent with data fetching
   - Implement infinite scrolling
   - Create a featured posts section for the home page
   - Add sorting and filtering options

3. **User Profile System**
   - Complete the user profile editing functionality
   - Implement the UserPostsComponent
   - Add ability to change profile picture

4. **Comment System**
   - Create comment components for post detail page
   - Implement nested/threaded replies
   - Add comment moderation for admin/authors

5. **Admin Features**
   - Complete admin dashboard with actual statistics
   - Implement user management in admin area
   - Add post moderation capabilities

6. **Polish & Testing**
   - Ensure consistent styling across all components
   - Improve error handling throughout the application
   - Test all routes and permissions
   - Add loading indicators and transitions
   - Augment the post sharing URL functionality to create a preview card HTML blob that can be posted to other social media media sites like linked in or messenger.

7. **Deployment & Documentation**
   - Set up proper Firestore security rules
   - Configure deployment to GitHub Pages
   - Document the application architecture
   - Create user guide for admin features

The most immediate priorities would be completing the basic post management and display functionality, as these form the core of the blogging system.