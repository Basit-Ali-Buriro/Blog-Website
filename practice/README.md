<div align="center">

# ✨ BlogSpace

### A Modern Full-Stack Blog Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <strong>Create, share, and discover amazing stories with BlogSpace</strong>
</p>

[Live Demo](#) · [Report Bug](https://github.com/yourusername/blogspace/issues) · [Request Feature](https://github.com/yourusername/blogspace/issues)

</div>

---

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/6366f1/ffffff?text=BlogSpace+Homepage" alt="Homepage" width="100%"/>
</div>

---

## ⚡ Features

<table>
  <tr>
    <td width="50%">
      <h3>🔐 Authentication</h3>
      <p>Secure login and signup with NextAuth.js, JWT sessions, and password hashing with bcryptjs</p>
    </td>
    <td width="50%">
      <h3>📝 Blog Management</h3>
      <p>Create, edit, delete, and publish blog posts with a rich editing experience</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📊 User Dashboard</h3>
      <p>Personal dashboard to manage your posts, view stats, and track your content</p>
    </td>
    <td width="50%">
      <h3>👑 Admin Panel</h3>
      <p>Admin users can manage all posts and users with elevated permissions</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📱 Responsive Design</h3>
      <p>Beautiful UI that works seamlessly on desktop, tablet, and mobile devices</p>
    </td>
    <td width="50%">
      <h3>🛡️ Role-based Access</h3>
      <p>User and Admin roles with different permissions and capabilities</p>
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
│       ├── 📄 Post.js         # 📝 Post model
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
| `POST` | `/api/posts` | Create a new post | ✅ |
| `GET` | `/api/posts/[id]` | Get a single post | ❌ |
| `PUT` | `/api/posts/[id]` | Update a post | ✅ |
| `DELETE` | `/api/posts/[id]` | Delete a post | ✅ |

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

Made with ❤️ and ☕

</div>
