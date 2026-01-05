import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Post from "@/lib/models/Post";

export async function POST(request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    // Parse request body
    const { title, content, published, excerpt, tags, featuredImage, status, metaDescription } = await request.json();

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

    // Validate tags if provided
    if (tags && (!Array.isArray(tags) || tags.length > 10)) {
      return NextResponse.json(
        { message: "Tags must be an array with maximum 10 items" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Determine post status
    let postStatus = status || 'draft';
    if (published !== undefined) {
      // Backward compatibility: if published is provided, use it
      postStatus = published ? 'published' : 'draft';
    }

    // Create new post
    const newPost = new Post({
      title: title.trim(),
      content: content.trim(),
      author: session.user.id,
      status: postStatus,
      excerpt: excerpt?.trim(),
      tags: tags || [],
      featuredImage: featuredImage?.trim() || '',
      metaDescription: metaDescription?.trim(),
    });

    // Save post
    await newPost.save();

    // Populate author info
    await newPost.populate("author", "name email");

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the post" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Get all published posts
    const posts = await Post.find({ published: true })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Posts retrieved successfully",
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
}