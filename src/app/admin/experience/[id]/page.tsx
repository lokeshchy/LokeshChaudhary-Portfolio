'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EXPERIENCE_TYPES, WORK_MODES } from '@/lib/experience-constants';

type Experience = {
  id: string;
  role: string;
  organization: string;
  location?: string;
  workMode?: string | null;
  startDate: string;
  endDate: string;
  description: string[];
  type: string;
  order: number;
  visible: boolean;
};

export default function AdminExperienceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const [entry, setEntry] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
      setEntry({
        id: '',
        role: '',
        organization: '',
        location: '',
        workMode: '',
        startDate: '',
        endDate: 'Present',
        description: [],
        type: 'Work',
        order: 0,
        visible: true,
      });
      return;
    }
    fetch(`/api/experience/${id}`)
      .then((r) => r.json())
      .then(setEntry)
      .catch(() => setEntry(null));
  }, [id, isNew]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!entry) return;
    setSaving(true);
    const url = isNew ? '/api/experience' : `/api/experience/${id}`;
    const method = isNew ? 'POST' : 'PUT';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(() => router.push('/admin/experience'))
      .catch(() => alert('Failed to save'))
      .finally(() => setSaving(false));
  }

  if (!entry) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <Link href="/admin/experience" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to Experience
      </Link>
      <h1 className="text-2xl font-semibold text-primary mb-6">
        {isNew ? 'New experience' : 'Edit experience'}
      </h1>
      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Role / Title</label>
            <input
              value={entry.role}
              onChange={(e) => setEntry((p) => (p ? { ...p, role: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Organization</label>
            <input
              value={entry.organization}
              onChange={(e) => setEntry((p) => (p ? { ...p, organization: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Location (optional)</label>
          <input
            value={entry.location ?? ''}
            onChange={(e) => setEntry((p) => (p ? { ...p, location: e.target.value || undefined } : p))}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Start date</label>
            <input
              value={entry.startDate}
              onChange={(e) => setEntry((p) => (p ? { ...p, startDate: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              placeholder="2022-01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">End date</label>
            <input
              value={entry.endDate}
              onChange={(e) => setEntry((p) => (p ? { ...p, endDate: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              placeholder="Present or 2023-06"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Type</label>
            <select
              value={entry.type}
              onChange={(e) => setEntry((p) => (p ? { ...p, type: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            >
              {EXPERIENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Work mode</label>
            <select
              value={entry.workMode ?? ''}
              onChange={(e) =>
                setEntry((p) => (p ? { ...p, workMode: e.target.value || null } : p))
              }
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            >
              <option value="">Not specified</option>
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Description (bullet points, one per line)</label>
          <textarea
            value={(entry.description || []).join('\n')}
            onChange={(e) =>
              setEntry((p) =>
                p ? { ...p, description: e.target.value.split('\n').filter(Boolean) } : p
              )
            }
            rows={5}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visible"
            checked={entry.visible}
            onChange={(e) => setEntry((p) => (p ? { ...p, visible: e.target.checked } : p))}
          />
          <label htmlFor="visible" className="text-sm text-muted">
            Visible on site
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
          <Link
            href="/admin/experience"
            className="px-6 py-2.5 border border-border rounded-button text-primary font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
