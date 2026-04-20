'use client';

import { useEffect, useState } from 'react';

type Settings = {
  siteName: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  footerText?: string;
  socialLinks: Record<string, string>;
  defaultSeoTitle?: string;
  defaultSeoDesc?: string;
};

const SOCIAL_KEYS = ['github', 'linkedin', 'facebook', 'instagram', 'twitter', 'email', 'phone'];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then(setSettings)
      .catch(() => alert('Failed to save'))
      .finally(() => setSaving(false));
  }

  if (!settings) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary mb-2">Settings</h1>
      <p className="text-muted mb-6">Global site settings and theme colors.</p>
      <form onSubmit={handleSave} className="max-w-xl space-y-6">
        <div className="bg-surface rounded-card shadow-card p-6 border border-border space-y-4">
          <h2 className="text-lg font-medium text-primary">General</h2>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Site name</label>
            <input
              value={settings.siteName}
              onChange={(e) => setSettings((s) => (s ? { ...s, siteName: e.target.value } : s))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Logo URL</label>
            <input
              value={settings.logo ?? ''}
              onChange={(e) => setSettings((s) => (s ? { ...s, logo: e.target.value || undefined } : s))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Favicon URL</label>
            <input
              value={settings.favicon ?? ''}
              onChange={(e) => setSettings((s) => (s ? { ...s, favicon: e.target.value || undefined } : s))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Footer text</label>
            <input
              value={settings.footerText ?? ''}
              onChange={(e) => setSettings((s) => (s ? { ...s, footerText: e.target.value || undefined } : s))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
        </div>

        <div className="bg-surface rounded-card shadow-card p-6 border border-border space-y-4">
          <h2 className="text-lg font-medium text-primary">Theme colors</h2>
          <p className="text-sm text-muted">
            The live site uses the palette in <code className="text-xs">globals.css</code> (light / dark via system preference).
            Values here are stored for reference only and do not override that theme.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Primary</label>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings((s) => (s ? { ...s, primaryColor: e.target.value } : s))}
                className="w-full h-10 rounded-button border border-border cursor-pointer"
              />
              <input
                value={settings.primaryColor}
                onChange={(e) => setSettings((s) => (s ? { ...s, primaryColor: e.target.value } : s))}
                className="w-full mt-1 px-2 py-1 text-sm border border-border rounded bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Accent</label>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings((s) => (s ? { ...s, accentColor: e.target.value } : s))}
                className="w-full h-10 rounded-button border border-border cursor-pointer"
              />
              <input
                value={settings.accentColor}
                onChange={(e) => setSettings((s) => (s ? { ...s, accentColor: e.target.value } : s))}
                className="w-full mt-1 px-2 py-1 text-sm border border-border rounded bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Background</label>
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings((s) => (s ? { ...s, backgroundColor: e.target.value } : s))}
                className="w-full h-10 rounded-button border border-border cursor-pointer"
              />
              <input
                value={settings.backgroundColor}
                onChange={(e) => setSettings((s) => (s ? { ...s, backgroundColor: e.target.value } : s))}
                className="w-full mt-1 px-2 py-1 text-sm border border-border rounded bg-background"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-card shadow-card p-6 border border-border space-y-4">
          <h2 className="text-lg font-medium text-primary">Social links</h2>
          {SOCIAL_KEYS.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-muted mb-1">{key}</label>
              <input
                value={settings.socialLinks?.[key] ?? ''}
                onChange={(e) =>
                  setSettings((s) =>
                    s
                      ? {
                          ...s,
                          socialLinks: { ...s.socialLinks, [key]: e.target.value },
                        }
                      : s
                  )
                }
                className="w-full px-3 py-2 border border-border rounded-button bg-background"
                placeholder={
                  key === 'email'
                    ? 'mailto:you@example.com'
                    : key === 'phone'
                      ? '+9779808672026'
                      : `https://${key}.com/...`
                }
              />
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-card shadow-card p-6 border border-border space-y-4">
          <h2 className="text-lg font-medium text-primary">Default SEO</h2>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Default meta title</label>
            <input
              value={settings.defaultSeoTitle ?? ''}
              onChange={(e) => setSettings((s) => (s ? { ...s, defaultSeoTitle: e.target.value || undefined } : s))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Default meta description</label>
            <textarea
              value={settings.defaultSeoDesc ?? ''}
              onChange={(e) => setSettings((s) => (s ? { ...s, defaultSeoDesc: e.target.value || undefined } : s))}
              rows={2}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-cta px-6 py-2.5 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
