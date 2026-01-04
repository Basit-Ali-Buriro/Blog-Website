import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Post from "@/lib/models/Post";
import Link from "next/link";

async function getAllUsers() {
  await dbConnect();
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

async function getAllPosts() {
  await dbConnect();
  const posts = await Post.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(posts));
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-red-100 mt-2">Manage all users and posts</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-black mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-black mb-2">Total Posts</h3>
            <p className="text-3xl font-bold text-green-600">{posts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-black mb-2">Published Posts</h3>
            <p className="text-3xl font-bold text-purple-600">
              {posts.filter((p) => p.published).length}
            </p>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-black">Name</th>
                  <th className="text-left py-3 px-4 text-black">Email</th>
                  <th className="text-left py-3 px-4 text-black">Role</th>
                  <th className="text-left py-3 px-4 text-black">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-black mb-6">All Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mt-1 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="mt-2 flex gap-2 items-center">
                      <span className="text-sm text-gray-600">
                        By: {post.author.name}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/dashboard/posts/${post._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
