'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Toast from '@/app/components/Toast';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
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

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create post');
        return;
      }

      setToast({ 
        message: `Post ${published ? 'published' : 'saved as draft'} successfully!`, 
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
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
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600 text-sm">Share your thoughts with the world</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
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
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all text-black text-lg ${
                  titleLength > 0 && !titleValid
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
                {titleLength > 100 && (
                  <span className="text-sm text-orange-600">Keep it concise!</span>
                )}
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
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all text-black resize-y ${
                  contentLength > 0 && !contentValid
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : contentValid
                    ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder="Write your amazing content here... Tell your story, share your insights, or express your ideas!"
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

            {/* Published Checkbox */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <label htmlFor="published" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Publish immediately
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {published 
                      ? '✓ Your post will be visible to everyone'
                      : 'Save as draft to publish later'}
                  </p>
                </div>
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
                    <span>{published ? 'Publishing...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {published ? 'Publish Post' : 'Save as Draft'}
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
