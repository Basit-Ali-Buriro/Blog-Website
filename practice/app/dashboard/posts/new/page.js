'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Toast from '@/app/components/Toast';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const titleLength = title.length;
  const contentLength = content.length;
  const titleValid = titleLength >= 3;
  const contentValid = contentLength >= 10;

  // Auto-generate excerpt from content
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Auto-generate excerpt if not manually set
    if (!excerpt && newContent.length > 0) {
      const autoExcerpt = newContent.substring(0, 200).trim();
      setExcerpt(autoExcerpt + (newContent.length > 200 ? '...' : ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titleValid || !contentValid) {
      setError('Please ensure title (min 3 chars) and content (min 10 chars) meet requirements');
      return;
    }

    // Parse tags from comma-separated string
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (tagArray.length > 10) {
      setError('Maximum 10 tags allowed');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || undefined,
          featuredImage: featuredImage || undefined,
          tags: tagArray.length > 0 ? tagArray : undefined,
          metaDescription: metaDescription || undefined,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create post');
        return;
      }

      setToast({
        message: `Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`,
        type: 'success'
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Share your thoughts with the world</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all text-black text-base sm:text-lg ${titleLength > 0 && !titleValid
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : titleValid
                      ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                placeholder="Enter an engaging title for your post"
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs sm:text-sm ${titleLength >= 3 ? 'text-green-600' : titleLength > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {titleLength > 0 && !titleValid ? '⚠ ' : titleValid ? '✓ ' : ''}
                  {titleLength} / 3 characters minimum
                </span>
              </div>
            </div>

            {/* Excerpt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black resize-y"
                placeholder="Brief summary of your post (auto-generated if left empty)"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {excerpt.length}/300 characters • Shown in post previews
              </p>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Post Content *
              </label>
              <textarea
                value={content}
                onChange={handleContentChange}
                required
                rows={12}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all text-black resize-y ${contentLength > 0 && !contentValid
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : contentValid
                      ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                placeholder="Write your amazing content here..."
              />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mt-2">
                <span className={`text-xs sm:text-sm ${contentLength >= 10 ? 'text-green-600' : contentLength > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {contentLength > 0 && !contentValid ? '⚠ ' : contentValid ? '✓ ' : ''}
                  {contentLength} / 10 characters minimum
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  ~{Math.ceil(contentLength / 200)} min read
                </span>
              </div>
            </div>

            {/* Featured Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Featured Image URL (Optional)
              </label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Add a cover image to make your post stand out
              </p>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black"
                placeholder="javascript, web development, tutorial (comma-separated, max 10)"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {tags.split(',').filter(t => t.trim()).length}/10 tags • Helps readers find your content
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Meta Description (Optional)
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                maxLength={160}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black resize-y"
                placeholder="SEO description for search engines (auto-generated if left empty)"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {metaDescription.length}/160 characters • Shown in search results
              </p>
            </div>

            {/* Status Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Post Status
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Draft</span>
                    <p className="text-xs text-gray-600">Save for later, not visible to others</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={status === 'published'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Published</span>
                    <p className="text-xs text-gray-600">Make it live and visible to everyone</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-200 flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={loading || !titleValid || !contentValid}
                className="flex-1 bg-gradient-blue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>{status === 'published' ? 'Publishing...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {status === 'published' ? 'Publish Post' : 'Save as Draft'}
                  </>
                )}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
