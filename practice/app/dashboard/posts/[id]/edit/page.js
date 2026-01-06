import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db/mongodb";
import Post from "@/lib/models/Post";
import EditPostForm from "@/app/components/EditPostForm";
import Link from "next/link";

async function getPost(postId) {
  await dbConnect();
  const post = await Post.findById(postId).populate("author", "name email");

  if (!post) {
    return null;
  }

  return JSON.parse(JSON.stringify(post));
}

export default async function EditPostPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    redirect("/dashboard");
  }

  // Check if user is author or admin
  if (post.author._id.toString() !== session.user.id && session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
              <p className="text-gray-600 text-sm">Make changes to your post</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <EditPostForm post={post} />
        </div>
      </main>
    </div>
  );
}