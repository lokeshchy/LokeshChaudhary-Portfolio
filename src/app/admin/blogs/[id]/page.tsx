'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  published: boolean;
  seoTitle: string;
  seoDesc: string;
};

export default function AdminBlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const [post, setPost] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
      setPost({
        id: '',
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        tags: [],
        published: false,
        seoTitle: '',
        seoDesc: '',
      });
      return;
    }
    fetch(`/api/blogs/${id}`)
      .then((r) => r.json())
      .then(setPost)
      .catch(() => setPost(null));
  }, [id, isNew]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    setSaving(true);
    const url = isNew ? '/api/blogs' : `/api/blogs/${id}`;
    const method = isNew ? 'POST' : 'PUT';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...post,
        slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-'),
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(() => router.push('/admin/blogs'))
      .catch(() => alert('Failed to save'))
      .finally(() => setSaving(false));
  }

  if (!post) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <Link href="/admin/blogs" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to Blogs
      </Link>
      <h1 className="text-2xl font-semibold text-primary mb-6">
        {isNew ? 'New post' : 'Edit post'}
      </h1>
      <form onSubmit={handleSave} className="max-w-3xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Title</label>
            <input
              value={post.title}
              onChange={(e) => setPost((p) => (p ? { ...p, title: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Slug</label>
            <input
              value={post.slug}
              onChange={(e) => setPost((p) => (p ? { ...p, slug: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Excerpt</label>
          <textarea
            value={post.excerpt ?? ''}
            onChange={(e) => setPost((p) => (p ? { ...p, excerpt: e.target.value } : p))}
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Content (Markdown)</label>
          <textarea
            value={post.content}
            onChange={(e) => setPost((p) => (p ? { ...p, content: e.target.value } : p))}
            rows={12}
            className="w-full px-3 py-2 border border-border rounded-button bg-background font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Featured image URL</label>
          <input
            value={post.featuredImage ?? ''}
            onChange={(e) => setPost((p) => (p ? { ...p, featuredImage: e.target.value } : p))}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Tags (comma-separated)</label>
          <input
            value={(post.tags || []).join(', ')}
            onChange={(e) =>
              setPost((p) =>
                p ? { ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) } : p
              )
            }
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">SEO title</label>
            <input
              value={post.seoTitle ?? ''}
              onChange={(e) => setPost((p) => (p ? { ...p, seoTitle: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">SEO description</label>
            <input
              value={post.seoDesc ?? ''}
              onChange={(e) => setPost((p) => (p ? { ...p, seoDesc: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={post.published}
            onChange={(e) => setPost((p) => (p ? { ...p, published: e.target.checked } : p))}
          />
          <label htmlFor="published" className="text-sm text-muted">
            Published
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-cta px-6 py-2.5 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/admin/blogs" className="px-6 py-2.5 border border-border rounded-button text-primary font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
