'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';

export default function EditPostForm({ post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(post.featuredImage || '');
  const [tags, setTags] = useState((post.tags || []).join(', '));
  const [metaDescription, setMetaDescription] = useState(post.metaDescription || '');
  const [status, setStatus] = useState(post.status || 'draft');
  const [published, setPublished] = useState(post.published);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const titleLength = title.length;
  const contentLength = content.length;
  const titleValid = titleLength >= 3;
  const contentValid = contentLength >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titleValid || !contentValid) {
      setError('Please ensure title (min 3 chars) and content (min 10 chars) meet requirements');
      return;
    }

    setLoading(true);

    // Parse tags from comma-separated string
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (tagArray.length > 10) {
      setError('Maximum 10 tags allowed');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
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
        setError(data.message || 'Failed to update post');
        return;
      }

      setToast({ message: 'Post updated successfully!', type: 'success' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setShowDeleteModal(false);

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to delete post');
        return;
      }

      setToast({ message: 'Post deleted successfully!', type: 'success' });
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
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Post</h3>
                <p className="text-gray-600 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete &quot;<strong>{post.title}</strong>&quot;? This will permanently remove the post and all its data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all text-black text-lg ${titleLength > 0 && !titleValid
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : titleValid
                ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
            placeholder="Enter an engaging title for your post"
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${titleLength >= 3 ? 'text-green-600' : titleLength > 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {titleLength > 0 && !titleValid ? '⚠ ' : titleValid ? '✓ ' : ''}
              {titleLength} / 3 characters minimum
            </span>
          </div>
        </div>

        {/* Content Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Post Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${contentLength >= 10 ? 'text-green-600' : contentLength > 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {contentLength > 0 && !contentValid ? '⚠ ' : contentValid ? '✓ ' : ''}
              {contentLength} / 10 characters minimum
            </span>
            <span className="text-sm text-gray-500">
              {contentLength} characters, ~{Math.ceil(contentLength / 5)} words
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
            placeholder="Brief summary of your post"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {excerpt.length}/300 characters
          </p>
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
            placeholder="javascript, web development, tutorial"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {tags.split(',').filter(t => t.trim()).length}/10 tags (comma-separated)
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
            placeholder="SEO description for search engines"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {metaDescription.length}/160 characters
          </p>
        </div>

        {/* Preview Section */}
        {content.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                {title || 'Your title will appear here'}
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {content}
              </p>
            </div>
          </div>
        )}

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
                <p className="text-xs text-gray-600">Not visible to others</p>
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
                <p className="text-xs text-gray-600">Visible to everyone</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="archived"
                checked={status === 'archived'}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Archived</span>
                <p className="text-xs text-gray-600">Hidden from public view</p>
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
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading || !titleValid || !contentValid}
            className="flex-1 bg-gradient-blue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Post
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>

          <Link
            href="/dashboard"
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
