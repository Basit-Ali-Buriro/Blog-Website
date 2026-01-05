<div align="center">

# ✨ BlogSpace

### A Modern Full-Stack Blog Platform with Advanced Features

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <strong>Create, share, and discover amazing stories with BlogSpace - featuring SEO optimization, tags, reading time estimates, and more!</strong>
</p>

[Live Demo](#) · [Report Bug](https://github.com/yourusername/blogspace/issues) · [Request Feature](https://github.com/yourusername/blogspace/issues)

</div>

---

## 🎯 What's New

### Latest Updates (v2.0)

- ✅ **Enhanced Post Schema** - Added excerpt, tags, featured images, and SEO metadata
- ✅ **Auto-Generation** - Automatic slug, reading time, and excerpt generation
- ✅ **View Tracking** - Track post popularity with view counters
- ✅ **Tag System** - Organize content with up to 10 tags per post
- ✅ **SEO Optimization** - Meta descriptions and SEO-friendly URLs
- ✅ **Status Management** - Draft, Published, and Archived post statuses
- ✅ **Mobile Responsive** - Fully optimized for all devices

---

## ⚡ Features

<table>
  <tr>
    <td width="50%">
      <h3>🔐 Authentication</h3>
      <p>Secure login and signup with NextAuth.js, JWT sessions, and password hashing with bcryptjs</p>
    </td>
    <td width="50%">
      <h3>📝 Advanced Blog Management</h3>
      <p>Create, edit, delete posts with rich features: tags, excerpts, featured images, and SEO metadata</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📊 User Dashboard</h3>
      <p>Personal dashboard to manage posts, view stats, and track content performance</p>
    </td>
    <td width="50%">
      <h3>🏷️ Tag System</h3>
      <p>Organize and categorize posts with tags (max 10 per post) for better content discovery</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⏱️ Reading Time</h3>
      <p>Auto-calculated reading time estimates based on content length (200 words/min)</p>
    </td>
    <td width="50%">
      <h3>👁️ View Tracking</h3>
      <p>Track post popularity with automatic view counter increments</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔍 SEO Optimized</h3>
      <p>SEO-friendly slugs, meta descriptions, and optimized URLs for better search rankings</p>
    </td>
    <td width="50%">
      <h3>📱 Responsive Design</h3>
      <p>Beautiful UI that works seamlessly on desktop, tablet, and mobile devices</p>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|:--------:|:----------:|
| **Framework** | Next.js 16 (App Router) |
| **Database** | MongoDB + Mongoose |
| **Auth** | NextAuth.js |
| **Styling** | Tailwind CSS 4 |
| **Security** | bcryptjs |
| **Language** | JavaScript (ES6+) |

</div>

---

## 📦 Post Schema

Each blog post includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Post title (required, min 3 chars) |
| `slug` | String | SEO-friendly URL (auto-generated) |
| `content` | String | Post content (required, min 10 chars) |
| `excerpt` | String | Short summary (max 300 chars, auto-generated) |
| `featuredImage` | String | URL to featured image |
| `tags` | Array | Up to 10 tags for categorization |
| `status` | Enum | draft, published, or archived |
| `readingTime` | Number | Estimated reading time in minutes (auto-calculated) |
| `views` | Number | View count (auto-incremented) |
| `metaDescription` | String | SEO meta description (max 160 chars) |
| `author` | ObjectId | Reference to User model |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

---

## 📁 Project Structure

```
📦 blogspace
├── 📂 app/
│   ├── 📂 admin/              # 👑 Admin panel
│   ├── 📂 api/
│   │   ├── 📂 auth/           # 🔐 NextAuth routes & signup
│   │   └── 📂 posts/          # 📝 Posts CRUD API
│   ├── 📂 auth/
│   │   ├── 📂 login/          # 🔑 Login page
│   │   └── 📂 signup/         # ✍️ Signup page
│   ├── 📂 components/         # 🧩 Reusable components
│   ├── 📂 dashboard/          # 📊 User dashboard
│   │   └── 📂 posts/          # 📝 Post management
│   ├── 📂 posts/              # 📰 Public posts pages
│   ├── 📄 layout.js           # 🎨 Root layout
│   └── 📄 page.js             # 🏠 Home page
├── 📂 lib/
│   ├── 📂 db/
│   │   └── 📄 mongodb.js      # 🗄️ Database connection
│   └── 📂 models/
│       ├── 📄 Post.js         # 📝 Enhanced Post model
│       └── 📄 User.js         # 👤 User model
└── 📂 public/                 # 🖼️ Static assets
```

---

## 🚀 Getting Started

### Prerequisites

> Before you begin, ensure you have the following installed:

- ✅ **Node.js** 18 or higher
- ✅ **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

> 💡 **Tip:** Generate a secure secret using: `openssl rand -base64 32`

### 📥 Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/blogspace.git

# 2️⃣ Navigate to the project
cd blogspace

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server
npm run dev
```

🎉 Open [http://localhost:3000](http://localhost:3000) to see the app!

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🔥 Start development server |
| `npm run build` | 📦 Build for production |
| `npm run start` | 🚀 Start production server |
| `npm run lint` | 🔍 Run ESLint |
| `npm run setup` | ⚙️ Run setup script |
| `npm run create-admin` | 👑 Create an admin user |

---

## 🔌 API Reference

### 🔐 Authentication

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/[...nextauth]` | NextAuth.js authentication |

### 📝 Posts

| Method | Endpoint | Description | Auth |
|:------:|----------|-------------|:----:|
| `GET` | `/api/posts` | Get all published posts | ❌ |
| `POST` | `/api/posts` | Create a new post (with tags, excerpt, etc.) | ✅ |
| `GET` | `/api/posts/[id]` | Get a single post (auto-increments views) | ❌ |
| `PUT` | `/api/posts/[id]` | Update a post (all fields supported) | ✅ |
| `DELETE` | `/api/posts/[id]` | Delete a post | ✅ |

#### POST/PUT Request Body Example

```json
{
  "title": "My Awesome Post",
  "content": "This is the full content of my post...",
  "excerpt": "A brief summary of the post",
  "featuredImage": "https://example.com/image.jpg",
  "tags": ["javascript", "web development", "tutorial"],
  "metaDescription": "Learn about web development with this tutorial",
  "status": "published"
}
```

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/blogspace)

</div>

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy! 🚀

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with ❤️ and ☕ by the BlogSpace Team**

</div>
