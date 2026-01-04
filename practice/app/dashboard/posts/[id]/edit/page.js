import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db/mongodb";
import Post from "@/lib/models/Post";
import EditPostForm from "@/app/components/EditPostForm";

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

  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    redirect("/dashboard");
  }

  // Check if user is author or admin
  if (post.author._id.toString() !== session.user.id && session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Edit Post</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <EditPostForm post={post} />
        </div>
      </main>
    </div>
  );
}