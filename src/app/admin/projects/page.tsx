'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  slug: string;
  overview: string;
  featured: boolean;
  deployed?: boolean;
  viewCode?: boolean;
  order: number;
};

export default function AdminProjectsPage() {
  const [list, setList] = useState<Project[]>([]);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);

  async function remove(id: string) {
    if (!confirm('Delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) setList((prev) => prev.filter((p) => p.id !== id));
  }

  async function moveUp(index: number) {
    if (index <= 0) return;
    setReordering(true);
    const a = list[index];
    const b = list[index - 1];
    const aNewOrder = b.order;
    const bNewOrder = a.order;
    try {
      await Promise.all([
        fetch(`/api/projects/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: aNewOrder }) }),
        fetch(`/api/projects/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: bNewOrder }) }),
      ]);
      setList((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], order: aNewOrder };
        next[index - 1] = { ...next[index - 1], order: bNewOrder };
        next.sort((x, y) => x.order - y.order);
        return next;
      });
    } finally {
      setReordering(false);
    }
  }

  async function moveDown(index: number) {
    if (index >= list.length - 1) return;
    setReordering(true);
    const a = list[index];
    const b = list[index + 1];
    const aNewOrder = b.order;
    const bNewOrder = a.order;
    try {
      await Promise.all([
        fetch(`/api/projects/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: aNewOrder }) }),
        fetch(`/api/projects/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: bNewOrder }) }),
      ]);
      setList((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], order: aNewOrder };
        next[index + 1] = { ...next[index + 1], order: bNewOrder };
        next.sort((x, y) => x.order - y.order);
        return next;
      });
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="btn-cta px-4 py-2 text-sm font-medium"
        >
          Add project
        </Link>
      </div>
      <p className="text-sm text-muted mb-4">Use ↑ ↓ to change the order projects appear on the site. Top of the list = first on the page.</p>
      <div className="bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left text-sm font-medium text-muted px-4 py-3 w-20">Order</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Title</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Slug</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Featured</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Demo</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Code</th>
              <th className="w-40" />
            </tr>
          </thead>
          <tbody>
            {list.map((p, index) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0 || reordering}
                      className="p-1.5 rounded border border-border text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === list.length - 1 || reordering}
                      className="p-1.5 rounded border border-border text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-primary font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted text-sm">{p.slug}</td>
                <td className="px-4 py-3">{p.featured ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">{p.deployed ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">{p.viewCode ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/admin/projects/${p.id}`} className="text-sm text-primary hover:underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
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
          <div className="px-4 py-8 text-center text-muted">No projects yet.</div>
        )}
      </div>
    </div>
  );
}
