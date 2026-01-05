import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from '@/lib/db/mongodb';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';

async function getPosts() {
  await dbConnect();
  // Ensure User model is registered before populating
  User;
  const posts = await Post.find({ published: true })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    author: {
      ...post.author,
      _id: post.author._id.toString()
    },
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  }));
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">BlogSpace</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/posts"
                className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                Explore
              </Link>
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="gradient-blue text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="gradient-blue text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-blue opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2  bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Welcome to the future of blogging
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Where Ideas Come
              <span className="block gradient-blue bg-clip-text text-white rounded-2xl">To Life</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of writers sharing their stories, insights, and expertise with the world.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/auth/signup"
                className="gradient-blue text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-xl shadow-purple-500/30 flex items-center gap-2"
              >
                Start Writing Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/posts"
                className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Explore Posts
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12 mt-16 pt-12 border-t border-gray-200">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">10K+</p>
                <p className="text-gray-600 mt-1">Active Writers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">50K+</p>
                <p className="text-gray-600 mt-1">Published Posts</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">1M+</p>
                <p className="text-gray-600 mt-1">Monthly Readers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose BlogSpace?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to create, publish, and grow your audience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 gradient-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy to Write</h3>
              <p className="text-gray-600">A distraction-free editor that lets you focus on what matters most - your content.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Grow Your Audience</h3>
              <p className="text-gray-600">Connect with readers who share your interests and build a loyal following.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Optimized for speed so your readers get the best experience every time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Fresh Content</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Latest Posts</h2>
            <p className="text-gray-600 mt-3">Discover what our community is writing about</p>
          </div>
          <Link
            href="/posts"
            className="hidden md:flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <div className="w-20 h-20 gradient-blue rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No posts yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your story with the world!</p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 gradient-blue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Start Writing
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Link href={`/posts/${post._id}`} key={post._id}>
                  <article className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    {/* Post Image */}
                    <div className={`h-52 flex items-center justify-center relative overflow-hidden ${
                      index % 3 === 0 ? 'gradient-blue' : 
                      index % 3 === 1 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 
                      'bg-gradient-to-br from-orange-400 to-pink-500'
                    }`}>
                      <svg className="w-16 h-16 text-white opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-white font-bold text-sm">
                            {post.author.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="text-purple-600 text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Read
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* View All Posts Button (Mobile) */}
            <div className="text-center mt-12 md:hidden">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 gradient-blue text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                View All Posts
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-blue py-20 px-6">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-white/90 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
              Join our community of passionate writers and start your blogging journey today. It&apos;s free to get started!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/auth/signup"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
              >
                Create Free Account
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/auth/login"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">BlogSpace</span>
            </div>
            
            <div className="flex items-center gap-8">
              <Link href="/posts" className="hover:text-white transition-colors">Explore</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link>
            </div>
            
            <p className="text-sm">© 2026 BlogSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

