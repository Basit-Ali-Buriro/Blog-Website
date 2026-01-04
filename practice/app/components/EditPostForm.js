'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditPostForm({ post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [published, setPublished] = useState(post.published);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
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
        setError(data.message || 'Failed to update post');
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to delete post');
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Post Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Enter post title (min 3 characters)"
        />
      </div>

      {/* Content Textarea */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Post Content *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Write your post content here (min 10 characters)"
        />
      </div>

      {/* Published Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="published" className="ml-2 text-sm text-black">
          Publish (uncheck to save as draft)
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? 'Deleting...' : 'Delete Post'}
        </button>
        <Link
          href="/dashboard"
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}