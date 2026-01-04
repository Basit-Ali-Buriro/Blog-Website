import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db/mongodb";
import Post from "@/lib/models/Post";
import Link from "next/link";

async function getUserPosts(userId) {
  await dbConnect();
  const posts = await Post.find({ author: userId })
    .populate("author", "name email")
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(posts));
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;
  const posts = await getUserPosts(userId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-blue-100 mt-2">Welcome, {session.user.name}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-black mb-4">Your Profile</h2>
          <div className="space-y-2 text-black">
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {session.user.role}
              </span>
            </p>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">Your Posts ({posts.length})</h2>
            <Link
              href="/dashboard/posts/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
              <Link
                href="/dashboard/posts/new"
                className="text-blue-600 hover:underline"
              >
                Create your first post
              </Link>
            </div>
          ) : (
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
                      <div className="mt-2 flex gap-2">
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
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}