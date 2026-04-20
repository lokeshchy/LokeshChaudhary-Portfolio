'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  order: number;
};

export default function AdminSkillEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const [skill, setSkill] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
      setSkill({
        id: '',
        name: '',
        category: 'Other',
        icon: '',
        order: 0,
      });
      return;
    }
    fetch(`/api/skills`)
      .then((r) => r.json())
      .then((list: Skill[]) => list.find((s) => s.id === id))
      .then((s) => setSkill(s ?? null))
      .catch(() => setSkill(null));
  }, [id, isNew]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!skill) return;
    setSaving(true);
    if (isNew) {
      fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then(() => router.push('/admin/skills'))
        .catch(() => alert('Failed to save'))
        .finally(() => setSaving(false));
    } else {
      fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then(() => router.push('/admin/skills'))
        .catch(() => alert('Failed to save'))
        .finally(() => setSaving(false));
    }
  }

  if (!skill) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <Link href="/admin/skills" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to Skills
      </Link>
      <h1 className="text-2xl font-semibold text-primary mb-6">
        {isNew ? 'New skill' : 'Edit skill'}
      </h1>
      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Name</label>
          <input
            value={skill.name}
            onChange={(e) => setSkill((p) => (p ? { ...p, name: e.target.value } : p))}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Category</label>
          <input
            value={skill.category}
            onChange={(e) => setSkill((p) => (p ? { ...p, category: e.target.value } : p))}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
            placeholder="e.g. Frontend, GIS, Backend, Tools"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Logo URL (HTTPS or Google Drive link)</label>
          <input
            value={skill.icon ?? ''}
            onChange={(e) => setSkill((p) => (p ? { ...p, icon: e.target.value || null } : p))}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
            placeholder="https://... or https://drive.google.com/file/d/.../view"
          />
          <p className="text-xs text-muted mt-1">
            Optional. You can paste a direct image URL or a Google Drive file link.
          </p>
          {skill.icon?.trim() && /^https?:\/\//i.test(skill.icon) && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-button border border-border bg-background px-2 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={toDisplayImageSrc(skill.icon)}
                alt=""
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs text-muted">Logo preview</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Order</label>
          <input
            type="number"
            value={skill.order}
            onChange={(e) => setSkill((p) => (p ? { ...p, order: parseInt(e.target.value, 10) || 0 } : p))}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-cta px-6 py-2.5 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/admin/skills" className="px-6 py-2.5 border border-border rounded-button text-primary font-medium">
            Cancel
          </Link>
        </div>
      </form>
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
