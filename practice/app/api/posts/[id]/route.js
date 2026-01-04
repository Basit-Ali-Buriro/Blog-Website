import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Post from "@/lib/models/Post";

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { title, content, published } = await request.json();

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    if (title.length < 3) {
      return NextResponse.json(
        { message: "Title must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { message: "Content must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find post
    const post = await Post.findById(id).populate("author", "name email");

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Check authorization (only author or admin can edit)
    if (post.author._id.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { message: "You don't have permission to edit this post" },
        { status: 403 }
      );
    }

    // Update post
    post.title = title.trim();
    post.content = content.trim();
    post.published = published;

    await post.save();
    await post.populate("author", "name email");

    return NextResponse.json(
      {
        message: "Post updated successfully",
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Connect to database
    await dbConnect();

    // Find post
    const post = await Post.findById(id).populate("author", "name email");

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Check authorization (only author or admin can delete)
    if (post.author._id.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { message: "You don't have permission to delete this post" },
        { status: 403 }
      );
    }

    // Delete post
    await Post.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post delete error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the post" },
      { status: 500 }
    );
  }
}