# Software Requirements Specification (SRS)
## Blog Website - Next.js Project

---

## 1. Project Overview

**Project Name:** Personal Blog Website  
**Framework:** Next.js 15 (App Router)  
**Purpose:** Create a modern, SEO-friendly blog website with dynamic routing and responsive design  
**Target Users:** Blog readers and content consumers

---

## 2. Technical Stack

- **Framework:** Next.js 15 (React-based)
- **Styling:** Tailwind CSS (already configured)
- **Language:** JavaScript
- **Routing:** App Router (file-based routing)
- **Deployment:** Vercel (recommended)
- **Data Source:** Static (Markdown/JSON files) - Can be upgraded to CMS later

---

## 3. Features & Requirements

### 3.1 Core Features (MVP)
- ✅ Homepage with list of blog posts
- ✅ Individual blog post pages with dynamic routing
- ✅ Responsive navigation bar
- ✅ About page
- ✅ Contact page
- ✅ Responsive footer
- ✅ SEO optimization (metadata, Open Graph)
- 📝 **Admin panel for blog management**
- 📝 **CRUD operations (Create, Read, Update, Delete) for blog posts**

### 3.2 Enhanced Features (Phase 2)
- 📝 Search functionality
- 📝 Categories/Tags filtering
- 📝 Pagination
- 📝 Related posts section
- 📝 Reading time estimation
- 📝 Dark mode toggle

### 3.3 Advanced Features (Phase 3)
- 📝 Comments system
- 📝 Newsletter subscription
- 📝 Social sharing buttons
- 📝 RSS feed
- 📝 Analytics integration

---

## 4. File & Folder Structure

```
practice/
├── app/
│   ├── layout.js                 # Root layout (Navbar + Footer)
│   ├── page.js                   # Homepage (Blog list)
│   ├── globals.css               # Global styles
│   │
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.js           # Individual blog post page
│   │
│   ├── about/
│   │   └── page.js               # About page
│   │
│   ├── contact/
│   │   └── page.js               # Contact page
│   │
│   ├── admin/                    # Admin panel (protected)
│   │   ├── layout.js             # Admin layout
│   │   ├── page.js               # Admin dashboard
│   │   └── posts/
│   │       ├── page.js           # List all posts (manage)
│   │       ├── create/
│   │       │   └── page.js       # Create new post
│   │       └── edit/
│   │           └── [id]/
│   │               └── page.js   # Edit existing post
│   │
│   └── api/                      # API routes
│       ├── posts/
│       │   ├── route.js          # GET all posts, POST create
│       │   └── [id]/
│       │       └── route.js      # GET, PUT, DELETE single post
│       └── search/
│           └── route.js          # Search API endpoint
│
├── components/
│   ├── Navbar.js                 # Navigation component
│   ├── Footer.js                 # Footer component
│   ├── BlogCard.js               # Blog post preview card
│   ├── BlogList.js               # List of blog cards
│   ├── SearchBar.js              # Search component
│   ├── CategoryFilter.js         # Category filter component
│   ├── BlogForm.js               # Blog post create/edit form
│   └── AdminNav.js               # Admin navigation component
│
├── lib/
│   ├── posts.js                  # Blog post CRUD operations
│   ├── utils.js                  # Helper functions
│   ├── constants.js              # Site configuration
│   └── auth.js                   # Authentication utilities (optional)
│
├── data/
│   └── posts.json                # Blog posts data
│
├── public/
│   └── images/
│       ├── blog/                 # Blog post images
│       └── icons/                # Site icons
│
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── SRS-BLOG-WEBSITE.md          # This document
```

---

## 5. Data Models

### 5.1 Blog Post Object
```javascript
{
  id: "unique-post-id",
  slug: "post-url-slug",
  title: "Blog Post Title",
  excerpt: "Short description of the post...",
  content: "Full blog post content (HTML or Markdown)",
  author: {
    name: "Author Name",
    avatar: "/images/author.jpg"
  },
  publishedDate: "2026-01-02",
  updatedDate: "2026-01-02",
  category: "Technology",
  tags: ["nextjs", "react", "web-development"],
  featuredImage: "/images/blog/post-image.jpg",
  readingTime: "5 min read"
}
```

### 5.2 Site Configuration
```javascript
{
  siteName: "My Blog",
  siteDescription: "A modern blog about web development",
  author: "Your Name",
  social: {
    twitter: "@yourhandle",
    github: "yourusername",
    linkedin: "yourprofile"
  },
  postsPerPage: 9
}
```

---

## 6. Page Specifications

### 6.1 Homepage (`/`)
**Purpose:** Display all blog posts in a grid layout

**Components:**
- Navbar
- Hero section (optional)
- BlogList component with BlogCards
- Pagination (if many posts)
- Footer

**Features:**
- Shows latest posts first
- Each post displays: image, title, excerpt, date, reading time
- Click on post card navigates to full post
- Responsive grid (1 column mobile, 2 tablet, 3 desktop)

---

### 6.2 Blog Post Page (`/blog/[slug]`)
**Purpose:** Display individual blog post content

**Components:**
- Navbar
- Post header (title, date, author, reading time)
- Featured image
- Post content (formatted HTML/Markdown)
- Category/Tags display
- Share buttons (optional)
- Related posts (optional)
- Footer

**Features:**
- Dynamic routing using slug
- SEO optimized with metadata
- Responsive typography
- Code syntax highlighting (if needed)
- Image optimization

---

### 6.3 About Page (`/about`)
**Purpose:** Information about the blog/author

**Components:**
- Navbar
- Hero section with profile image
- About content
- Skills/Interests section
- Footer

---

### 6.4 Contact Page (`/contact`)
**Purpose:** Contact form or contact information

**Components:**
- Navbar
- Contact form (name, email, message)
- Social links
- Footer

**Features:**
- Form validation
- Success/error messages

---

### 6.5 Admin Dashboard (`/admin`)
**Purpose:** Central hub for managing blog posts

**Components:**
- Admin navigation
- Statistics cards (total posts, views, etc.)
- Recent posts list
- Quick actions (Create new post)

**Features:**
- Overview of blog statistics
- Quick access to post management
- Protected route (authentication required)

---

### 6.6 Manage Posts Page (`/admin/posts`)
**Purpose:** View and manage all blog posts

**Components:**
- Admin navigation
- Posts table/list with:
  - Title
  - Status (published/draft)
  - Date
  - Category
  - Actions (Edit, Delete)
- Create new post button
- Search and filter options

**Features:**
- List all posts in table format
- Sort by date, title, category
- Search posts by title
- Delete confirmation dialog
- Bulk actions (optional)

---

### 6.7 Create Post Page (`/admin/posts/create`)
**Purpose:** Create a new blog post

**Components:**
- Admin navigation
- BlogForm component with fields:
  - Title (required)
  - Slug (auto-generated from title, editable)
  - Excerpt (required)
  - Content (rich text editor or textarea)
  - Category (dropdown)
  - Tags (multi-select or comma-separated)
  - Featured Image (file upload or URL)
  - Author info (name, avatar)
  - Status (Draft/Published)
- Save and Publish buttons
- Preview option

**Features:**
- Form validation
- Auto-generate slug from title
- Auto-save draft (optional)
- Image upload/preview
- Rich text editor for content
- Success/error messages

---

### 6.8 Edit Post Page (`/admin/posts/edit/[id]`)
**Purpose:** Edit an existing blog post

**Components:**
- Admin navigation
- BlogForm component (pre-filled with post data)
- Update and Delete buttons
- Last updated timestamp

**Features:**
- Load existing post data
- Same validation as create page
- Update confirmation
- Delete with confirmation
- Track updatedDate automatically

---

## 7. Component Specifications

### 7.1 Navbar Component
**File:** `components/Navbar.js`

**Features:**
- Logo/Site name (left)
- Navigation links (Home, About, Contact)
- Responsive mobile menu (hamburger)
- Active link highlighting
- Sticky/fixed position

---

### 7.2 BlogCard Component
**File:** `components/BlogCard.js`

**Props:**
- post (object): Contains all post data

**Features:**
- Featured image with hover effect
- Post title (clickable)
- Excerpt (truncated)
- Publish date
- Reading time
- Category badge
- Link to full post

---

### 7.3 Footer Component
**File:** `components/Footer.js`

**Features:**
- Copyright notice
- Social media links
- Quick links (Home, About, Contact)
- Optional: Newsletter signup

---

### 7.4 BlogForm Component
**File:** `components/BlogForm.js`

**Props:**
- post (object, optional): Existing post data for editing
- onSubmit (function): Form submission handler
- isEditing (boolean): Edit mode flag

**Features:**
- All input fields for blog post creation/editing
- Form validation (client-side)
- Auto-generate slug from title
- Character count for excerpt
- Image preview
- Tag input with chips
- Draft/Publish toggle
- Cancel and Submit buttons

---

### 7.5 AdminNav Component
**File:** `components/AdminNav.js`

**Features:**
- Admin-specific navigation
- Links to Dashboard, Manage Posts, Create Post
- Logout button (if auth implemented)
- Back to site link
- Current page highlighting

---

## 8. User Flow Diagrams

### 8.1 Main User Journey
```
User visits site (/)
    ↓
Views blog post list
    ↓
Clicks on a blog post
    ↓
Reads full blog post (/blog/[slug])
    ↓
[Optional] Clicks related post
    ↓
[Optional] Navigates to About page
    ↓
[Optional] Navigates to Contact page
```

### 8.2 Navigation Flow
```
Any Page
    ↓
Navbar always visible
    ↓
User can navigate to:
    - Home (/)
    - About (/about)
    - Contact (/contact)
    - Any blog post (/blog/[slug])
```

---

## 9. Implementation Phases

### Phase 1: Foundation (MVP)
**Goal:** Get basic blog working with read functionality

**Steps:**
1. Clean up existing files (remove unused code)
2. Create site configuration and constants
3. Create sample blog post data (JSON file)
4. Build Navbar component
5. Build Footer component
6. Update root layout with Navbar + Footer
7. Build BlogCard component
8. Build Homepage with blog list
9. Build dynamic blog post page
10. Add basic styling with Tailwind
11. Test all routes and navigation

**Duration:** 2-3 hours

---

### Phase 1.5: Admin Panel & CRUD Operations
**Goal:** Enable blog post management

**Steps:**
1. Create data management functions in `lib/posts.js`:
   - `createPost()`
   - `updatePost()`
   - `deletePost()`
   - `getPostById()`
   - `generateSlug()`
   - `calculateReadingTime()`
2. Build API routes:
   - `POST /api/posts` (create)
   - `GET /api/posts/[id]` (read)
   - `PUT /api/posts/[id]` (update)
   - `DELETE /api/posts/[id]` (delete)
3. Create BlogForm component (reusable for create/edit)
4. Build admin layout with AdminNav
5. Build admin dashboard (`/admin`)
6. Build manage posts page (`/admin/posts`) with list and delete
7. Build create post page (`/admin/posts/create`)
8. Build edit post page (`/admin/posts/edit/[id]`)
9. Add form validation and error handling
10. Test all CRUD operations
11. Add success/error notifications

**Duration:** 3-4 hours

---

### Phase 2: Content & Styling
**Goal:** Make it look professional

**Steps:**
1. Create 5-10 sample blog posts with real content
2. Add featured images for each post
3. Enhance styling (hover effects, transitions)
4. Improve typography
5. Add responsive design breakpoints
6. Create About page content
7. Create Contact page with form
8. Add SEO metadata to all pages
9. Test on mobile, tablet, desktop

**Duration:** 2-3 hours

---

### Phase 3: Enhanced Features
**Goal:** Add advanced functionality

**Steps:**
1. Add authentication to protect admin routes (optional)
2. Implement search functionality
3. Add category filtering
4. Add pagination (if >9 posts)
5. Add related posts section
6. Add reading progress bar
7. Implement dark mode
8. Add social sharing buttons
9. Optimize images (Next.js Image component)
10. Add loading states
11. Add 404 page
12. Add draft/published status filtering in admin
13. Add rich text editor for blog content (TinyMCE, Tiptap, etc.)
14. Add image upload functionality

**Duration:** 4-5 hours

---

### Phase 4: Deployment & Polish
**Goal:** Launch the website

**Steps:**
1. Test all features thoroughly
2. Fix any bugs
3. Optimize performance (Lighthouse scores)
4. Set up Vercel deployment
5. Connect custom domain (optional)
6. Set up analytics (optional)
7. Create RSS feed (optional)
8. Final testing on production

**Duration:** 1-2 hours

---

## 10. Technical Implementation Details

### 10.1 Routing Strategy
- **App Router:** Use Next.js 15 App Router
- **Dynamic Routes:** `/blog/[slug]/page.js` for individual posts
- **Static Generation:** Use `generateStaticParams()` for blog posts
- **Metadata:** Export metadata object from each page

### 10.2 Data Management & CRUD Operations
```javascript
// lib/posts.js

// READ Operations
export function getAllPosts() {
  // Read from data/posts.json
  // Sort by date (newest first)
  // Return array of posts
}

export function getPostBySlug(slug) {
  // Find post with matching slug
  // Return single post object
}

export function getPostById(id) {
  // Find post with matching id
  // Return single post object
}

export function getPostsByCategory(category) {
  // Filter posts by category
  // Return filtered array
}

// CREATE Operation
export function createPost(postData) {
  // Generate unique ID
  // Add publishedDate timestamp
  // Calculate reading time
  // Add post to posts.json
  // Return created post
}

// UPDATE Operation
export function updatePost(id, postData) {
  // Find post by ID
  // Update fields
  // Update updatedDate timestamp
  // Recalculate reading time
  // Save to posts.json
  // Return updated post
}

// DELETE Operation
export function deletePost(id) {
  // Find post by ID
  // Remove from posts.json
  // Return success/failure
}

// UTILITY Functions
export function generateSlug(title) {
  // Convert title to URL-friendly slug
  // Ensure uniqueness
}

export function calculateReadingTime(content) {
  // Calculate based on word count
  // Average 200-250 words per minute
  // Return "X min read"
}
```

### 10.3 API Routes Structure
```javascript
// app/api/posts/route.js
// GET  /api/posts - Get all posts
// POST /api/posts - Create new post

// app/api/posts/[id]/route.js
// GET    /api/posts/[id] - Get single post
// PUT    /api/posts/[id] - Update post
// DELETE /api/posts/[id] - Delete post
```

**Request/Response Format:**
```javascript
// POST /api/posts (Create)
Request Body:
{
  title: "Post Title",
  slug: "post-title",
  excerpt: "Short description",
  content: "Full content",
  category: "Technology",
  tags: ["nextjs", "react"],
  featuredImage: "/images/blog/image.jpg",
  author: {
    name: "Author Name",
    avatar: "/images/author.jpg"
  },
  status: "published" // or "draft"
}

Response:
{
  success: true,
  post: { ...created post with id and dates }
}

// PUT /api/posts/[id] (Update)
Request Body: (same as create)
Response:
{
  success: true,
  post: { ...updated post }
}

// DELETE /api/posts/[id]
Response:
{
  success: true,
  message: "Post deleted successfully"
}
```

### 10.4 Authentication Strategy (Optional)
**For protecting admin routes:**
- **Option 1:** Simple password protection (environment variable)
- **Option 2:** NextAuth.js with credentials provider
- **Option 3:** Third-party auth (Clerk, Auth0)
- **Option 4:** Skip auth for development (add later)

**Implementation approach:**
- Middleware to protect `/admin/*` routes
- Session management
- Login page (`/admin/login`)
- Logout functionality

**Note:** For MVP, you can start without authentication and add it in Phase 2.

### 10.5 SEO Strategy
- Dynamic metadata for each post
- Open Graph tags for social sharing
- Semantic HTML structure
- Image alt texts
- Sitemap generation
- robots.txt

---

## 11. Testing Checklist

### Functionality Testing
- [ ] All navigation links work
- [ ] Blog post pages load correctly
- [ ] Dynamic routing works for all slugs
- [ ] Forms submit successfully (if applicable)
- [ ] Search returns correct results
- [ ] Filters work properly
- [ ] **CRUD Operations:**
  - [ ] Create new blog post successfully
  - [ ] Read/view all posts in admin panel
  - [ ] Update existing post successfully
  - [ ] Delete post with confirmation
  - [ ] Slug auto-generation works
  - [ ] Reading time calculation is accurate
  - [ ] Form validation catches errors
  - [ ] Success/error messages display correctly

### Responsive Testing
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1920px+)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] Fast page load times
- [ ] Optimized images
- [ ] No console errors

---

## 12. Success Metrics

- ✅ All pages load without errors
- ✅ Responsive on all devices
- ✅ SEO score > 90
- ✅ Accessibility score > 90
- ✅ Fast page transitions
- ✅ Clean, professional design
- ✅ **Easy to manage blog posts through admin panel**
- ✅ **All CRUD operations work seamlessly**
- ✅ **No data loss during updates**

---

## 13. Future Enhancements

### Content Management
- Integrate with headless CMS (Sanity, Contentful, Strapi)
- Markdown file support with MDX
- ~~Admin panel for content management~~ ✅ **Implemented**
- Database integration (PostgreSQL, MongoDB) instead of JSON
- Media library for image management
- Bulk import/export posts
- Version control for posts (revision history)

### User Engagement
- Comments system (Disqus, Comments.js)
- Like/reaction buttons
- View counter
- Newsletter integration (Mailchimp, ConvertKit)

### Advanced Features
- Multi-author support
- Guest posting
- Draft/scheduled posts (post scheduling)
- Featured/pinned posts
- Series/collections of posts
- Post analytics (views, likes, shares)
- SEO score checker for posts
- Auto-save drafts while editing
- Post preview before publishing
- Duplicate post feature

---

## 14. Getting Started

### Current Status
You already have:
- ✅ Next.js project initialized
- ✅ Tailwind CSS configured
- ✅ Basic folder structure
- ✅ Navbar component (needs refinement)
- ✅ Contact page (basic)
- ✅ Dynamic route structure

### Next Steps
1. Review this SRS document
2. Decide on which features to implement first
3. Start with Phase 1 (Foundation)
4. Build components one by one
5. Test as you go

---

## 15. Resources & References

### Documentation
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Docs: https://react.dev

### Design Inspiration
- Medium.com - Blog layout
- Dev.to - Developer blog design
- Ghost themes - Professional blog themes

### Tools
- Figma - Design mockups
- Unsplash - Free blog images
- Font Awesome - Icons
- Google Fonts - Typography

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**Author:** GitHub Copilot  
**Project:** Practice Blog Website
