'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  order: number;
};

export default function AdminSkillsPage() {
  const [list, setList] = useState<Skill[]>([]);

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);

  async function remove(id: string) {
    if (!confirm('Delete this skill?')) return;
    const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    if (res.ok) setList((prev) => prev.filter((s) => s.id !== id));
  }

  const byCategory = list.reduce<Record<string, Skill[]>>((acc, s) => {
    const c = s.category || 'Other';
    if (!acc[c]) acc[c] = [];
    acc[c].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="btn-cta px-4 py-2 text-sm font-medium"
        >
          Add skill
        </Link>
      </div>
      <div className="space-y-6">
        {Object.entries(byCategory).map(([category, skills]) => (
          <div key={category} className="bg-surface rounded-card shadow-card border border-border overflow-hidden">
            <h2 className="px-4 py-3 bg-background border-b border-border text-sm font-medium text-muted">
              {category}
            </h2>
            <table className="w-full">
              <tbody>
                {skills.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-primary font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-muted text-sm">
                      {s.icon && /^https?:\/\//i.test(s.icon) ? (
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={toDisplayImageSrc(s.icon)}
                            alt=""
                            className="w-5 h-5 object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs text-muted">URL</span>
                        </div>
                      ) : (
                        s.icon || '—'
                      )}
                    </td>
                    <td className="px-4 py-3 w-24">
                      <Link
                        href={`/admin/skills/${s.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(s.id)}
                        className="ml-3 text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <div className="bg-surface rounded-card shadow-card border border-border p-8 text-center text-muted">
          No skills yet.
        </div>
      )}
    </div>
  );
}

function toDisplayImageSrc(url: string): string {
  const filePath = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const openId = url.match(/drive\.google\.com\/open\?[^#]*id=([a-zA-Z0-9_-]+)/);
  const id = filePath?.[1] || openId?.[1];
  if (id) return `/api/cert-image?id=${encodeURIComponent(id)}`;
  return url;
}
