'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function AdminExperiencePage() {
  const [list, setList] = useState<Experience[]>([]);

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);

  async function remove(id: string) {
    if (!confirm('Delete this entry?')) return;
    const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    if (res.ok) setList((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Experience</h1>
        <Link
          href="/admin/experience/new"
          className="btn-cta px-4 py-2 text-sm font-medium"
        >
          Add entry
        </Link>
      </div>
      <div className="bg-surface rounded-card shadow-card border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Role</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Organization</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Dates</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Type</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Work mode</th>
              <th className="text-left text-sm font-medium text-muted px-4 py-3">Visible</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-primary font-medium">{e.role}</td>
                <td className="px-4 py-3 text-muted">{e.organization}</td>
                <td className="px-4 py-3 text-muted text-sm">
                  {e.startDate} – {e.endDate}
                </td>
                <td className="px-4 py-3 text-muted text-sm">{e.type}</td>
                <td className="px-4 py-3 text-muted text-sm">{e.workMode || '—'}</td>
                <td className="px-4 py-3">{e.visible ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Link
                    href={`/admin/experience/${e.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(e.id)}
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
          <div className="px-4 py-8 text-center text-muted">No experience entries yet.</div>
        )}
      </div>
    </div>
  );
}
