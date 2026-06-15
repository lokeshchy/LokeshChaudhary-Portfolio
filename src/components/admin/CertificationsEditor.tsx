'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CertificationEntry, CertificationItem } from '@/types';
import { normalizeCertifications } from '@/lib/certifications';
import { certificationImageImgSrc } from '@/lib/cert-image-url';

type AboutPayload = {
  title: string;
  content: Record<string, unknown>;
  seoTitle: string | null;
  seoDesc: string | null;
};

type Row = CertificationEntry & { _key: string };

function itemToRow(item: CertificationItem, i: number): Row {
  if (typeof item === 'string') {
    return { _key: `row-${i}-${crypto.randomUUID()}`, title: item };
  }
  return {
    _key: `row-${i}-${crypto.randomUUID()}`,
    title: item.title || '',
    issuer: item.issuer || '',
    issued: item.issued || '',
    credentialId: item.credentialId || '',
    skills: item.skills || '',
    image: item.image || '',
  };
}

function rowsToCertifications(rows: Row[]): CertificationItem[] {
  return rows
    .filter((r) => r.title.trim())
    .map(({ _key: _k, ...rest }) => {
      const title = rest.title.trim();
      const issuer = rest.issuer?.trim();
      const issued = rest.issued?.trim();
      const credentialId = rest.credentialId?.trim();
      const skills = rest.skills?.trim();
      const image = rest.image?.trim();
      const hasExtra = !!(issuer || issued || credentialId || skills || image);
      if (!hasExtra) return title;
      return {
        title,
        ...(issuer ? { issuer } : {}),
        ...(issued ? { issued } : {}),
        ...(credentialId ? { credentialId } : {}),
        ...(skills ? { skills } : {}),
        ...(image ? { image } : {}),
      };
    });
}

export function CertificationsEditor({ aboutPage }: { aboutPage: AboutPayload | null }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!aboutPage) return;
    const items = normalizeCertifications(aboutPage.content.certifications);
    setRows(items.map(itemToRow));
  }, [aboutPage]);

  function updateRow(key: string, patch: Partial<CertificationEntry>) {
    setRows((prev) => prev.map((r) => (r._key === key ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        _key: `row-new-${crypto.randomUUID()}`,
        title: '',
        issuer: '',
        issued: '',
        credentialId: '',
        skills: '',
        image: '',
      },
    ]);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r._key !== key));
  }

  function moveRow(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    setRows((prev) => {
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  function handleSave() {
    if (!aboutPage) return;
    const certifications = rowsToCertifications(rows);
    setSaving(true);
    fetch('/api/pages/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: aboutPage.title,
        content: { ...aboutPage.content, certifications },
        seoTitle: aboutPage.seoTitle,
        seoDesc: aboutPage.seoDesc,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(() => window.location.reload())
      .catch(() => alert('Failed to save certifications'))
      .finally(() => setSaving(false));
  }

  if (!aboutPage) {
    return <p className="text-muted">Loading about page…</p>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <p className="text-sm text-muted">
        These entries appear on the public{' '}
        <Link href="/about#certifications" className="text-primary underline font-medium">
          Resume
        </Link>{' '}
        page. Paste a normal Google Drive share link for <strong>Image URL</strong> (set access to
        &quot;Anyone with the link&quot;).
      </p>

      <ul className="space-y-6">
        {rows.map((row, i) => (
          <li
            key={row._key}
            className="bg-surface rounded-card shadow-card p-4 border border-border space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Certificate {i + 1}
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => moveRow(i, -1)}
                  disabled={i === 0}
                  className="px-2 py-1 text-xs rounded-button border border-border bg-background disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(i, 1)}
                  disabled={i === rows.length - 1}
                  className="px-2 py-1 text-xs rounded-button border border-border bg-background disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(row._key)}
                  className="px-2 py-1 text-xs text-red-600 rounded-button border border-red-200 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted mb-1">Title *</label>
                <input
                  value={row.title}
                  onChange={(e) => updateRow(row._key, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background text-sm"
                  placeholder="Certificate or course name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Issuer</label>
                <input
                  value={row.issuer || ''}
                  onChange={(e) => updateRow(row._key, { issuer: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Issued</label>
                <input
                  value={row.issued || ''}
                  onChange={(e) => updateRow(row._key, { issued: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background text-sm"
                  placeholder="Jan 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Credential ID</label>
                <input
                  value={row.credentialId || ''}
                  onChange={(e) => updateRow(row._key, { credentialId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Skills</label>
                <input
                  value={row.skills || ''}
                  onChange={(e) => updateRow(row._key, { skills: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background text-sm"
                  placeholder="Python, React, …"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted mb-1">Image URL</label>
                <input
                  value={row.image || ''}
                  onChange={(e) => updateRow(row._key, { image: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background font-mono text-xs"
                  placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
                />
              </div>
            </div>
            {row.image?.trim() && certificationImageImgSrc(row.image) && (
              <div className="rounded-button border border-border overflow-hidden bg-background max-h-40 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certificationImageImgSrc(row.image)}
                  alt=""
                  className="max-h-40 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={addRow} className="btn-cta px-4 py-2 text-sm">
          Add certificate
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm rounded-button bg-primary text-white font-medium disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save all certifications'}
        </button>
      </div>
    </div>
  );
}
