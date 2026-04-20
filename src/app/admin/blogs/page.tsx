'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Blog = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
};

export default function AdminBlogsPage() {
  const [list, setList] = useState<Blog[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) setList((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="btn-cta px-4 py-2 text-sm font-medium"
        >
          New post
        </Link>
      </div>
      <div className="bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Title</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Status</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Date</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-primary font-medium">{b.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm ${b.published ? 'text-green-600' : 'text-amber-600'}`}
                  >
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted text-sm">
                  {b.publishedAt
                    ? new Date(b.publishedAt).toLocaleDateString()
                    : new Date(b.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/admin/blogs/${b.id}`} className="text-sm text-primary hover:underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(b.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="px-4 py-8 text-center text-muted">No blog posts yet.</div>
        )}
      </div>
    </div>
  );
}
