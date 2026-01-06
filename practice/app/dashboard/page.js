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

async function getStats(userId) {
  await dbConnect();
  const totalPosts = await Post.countDocuments({ author: userId });
  const publishedPosts = await Post.countDocuments({ author: userId, status: 'published' });
  const draftPosts = await Post.countDocuments({ author: userId, status: 'draft' });
  const archivedPosts = await Post.countDocuments({ author: userId, status: 'archived' });

  return { totalPosts, publishedPosts, draftPosts, archivedPosts };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;
  const posts = await getUserPosts(userId);
  const stats = await getStats(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold text-sm sm:text-base">Home</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg hover:from-red-600 hover:to-red-700 font-semibold transform hover:scale-105 transition-all shadow-md text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
              )}
              <Link
                href="/api/auth/signout"
                className="text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-blue text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold">
              {session.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Welcome back, {session.user.name}!</h1>
              <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">{session.user.email}</p>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.publishedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 transform hover:scale-105 transition-all card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Drafts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.draftPosts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {/* Posts Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Posts</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{posts.length} {posts.length === 1 ? 'post' : 'posts'} total</p>
            </div>
            <Link
              href="/dashboard/posts/new"
              className="bg-gradient-blue text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:opacity-90 font-semibold transform hover:scale-105 transition-all shadow-md flex items-center gap-2 justify-center text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create New Post</span>
              <span className="sm:hidden">New Post</span>
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Start sharing your thoughts with the world!</p>
              <Link
                href="/dashboard/posts/new"
                className="inline-block bg-gradient-blue text-white px-6 py-3 rounded-lg hover:opacity-90 font-semibold transform hover:scale-105 transition-all"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all card-hover bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {post.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.updatedAt !== post.createdAt && (
                          <span className="text-gray-400">
                            • Updated {new Date(post.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/posts/${post._id}/edit`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap transform hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
