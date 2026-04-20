'use client';

import { Suspense, useEffect, useState } from 'react';
import { normalizeCertifications } from '@/lib/certifications';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CertificationsEditor } from '@/components/admin/CertificationsEditor';

const SYSTEM_SLUGS = [
  'home',
  'about',
  'projects',
  'blog',
  'experience',
  'contact',
  'certifications',
  'certification',
];
const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'featured-projects', label: 'Featured Projects' },
  { value: 'about-preview', label: 'About Preview' },
  { value: 'skills-snapshot', label: 'Skills Snapshot' },
  { value: 'experience-preview', label: 'Experience Preview' },
  { value: 'latest-blogs', label: 'Latest Blogs' },
  { value: 'cta', label: 'CTA Section' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'custom', label: 'Custom (title + content)' },
];

type PageRecord = { id: string; slug: string; title: string };
type Section = { id: string; type: string; enabled: boolean; order: number; data?: Record<string, unknown> };

function AdminPagesPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || 'home';
  const [pagesList, setPagesList] = useState<PageRecord[]>([]);
  const [page, setPage] = useState<{
    title: string;
    content: Record<string, unknown>;
    seoTitle: string | null;
    seoDesc: string | null;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [addingPage, setAddingPage] = useState(false);
  const [certAboutPage, setCertAboutPage] = useState<{
    title: string;
    content: Record<string, unknown>;
    seoTitle: string | null;
    seoDesc: string | null;
  } | null>(null);
  const [certAboutReady, setCertAboutReady] = useState(false);

  const isCertificationsEditor = slug === 'certification';

  useEffect(() => {
    fetch('/api/pages')
      .then((r) => r.json())
      .then(setPagesList)
      .catch(() => setPagesList([]));
  }, []);

  useEffect(() => {
    if (slug === 'certification') {
      setPage(null);
      setCertAboutReady(false);
      fetch('/api/pages/about')
        .then((r) => r.json())
        .then((d) => {
          setCertAboutPage(d);
          setCertAboutReady(true);
        })
        .catch(() => {
          setCertAboutPage(null);
          setCertAboutReady(true);
        });
      return;
    }
    setCertAboutPage(null);
    setCertAboutReady(false);
    fetch(`/api/pages/${slug}`)
      .then((r) => r.json())
      .then((d) => setPage(d))
      .catch(() => setPage(null));
  }, [slug]);

  function handleSave() {
    if (!page) return;
    const payload = page;
    setSaving(true);
    fetch(`/api/pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((d) => setPage(d))
      .then(() => fetch('/api/pages').then((r) => r.json()).then(setPagesList))
      .catch(() => alert('Failed to save'))
      .finally(() => setSaving(false));
  }

  function handleAddPage(e: React.FormEvent) {
    e.preventDefault();
    if (!newPageSlug.trim() || !newPageTitle.trim()) return;
    setAddingPage(true);
    fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: newPageSlug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title: newPageTitle.trim(),
        content: { body: '' },
      }),
    })
      .then((r) => r.ok ? r.json() : r.json().then((d) => Promise.reject(d)))
      .then((created) => {
        const slugToUse = created?.slug || newPageSlug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setPagesList((prev) => [...prev, { id: created?.id || '', slug: slugToUse, title: created?.title || newPageTitle }]);
        setNewPageSlug('');
        setNewPageTitle('');
        window.location.href = `/admin/pages?slug=${encodeURIComponent(slugToUse)}`;
      })
      .catch((err) => alert(err?.error || 'Failed to add page'))
      .finally(() => setAddingPage(false));
  }

  function handleDeletePage(pageSlug: string) {
    if (!confirm(`Delete page "${pageSlug}"? This cannot be undone.`)) return;
    fetch(`/api/pages/${pageSlug}`, { method: 'DELETE' })
      .then((r) => r.ok ? setPagesList((prev) => prev.filter((p) => p.slug !== pageSlug)) : r.json().then((d) => Promise.reject(d)))
      .then(() => { if (slug === pageSlug) window.location.href = '/admin/pages?slug=home'; })
      .catch((err) => alert(err?.error || 'Failed to delete'));
  }

  const loadingEditor =
    (!isCertificationsEditor && !page && pagesList.length > 0) ||
    (isCertificationsEditor && !certAboutReady);

  if (loadingEditor) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-6">Pages</h1>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const hero = page?.content?.hero as { title: string; subtitles: string[]; ctaText: string; ctaLink: string } | undefined;
  const sections = (page?.content?.sections as Section[] | undefined) || [];
  const isSystemPage = SYSTEM_SLUGS.includes(slug);
  const isCustomPage = !isSystemPage;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary mb-2">Pages</h1>

      {/* Page tabs + Add page */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link
          href="/admin/pages?slug=certification"
          className={`px-4 py-2 rounded-button text-sm font-medium ${
            slug === 'certification'
              ? 'bg-primary text-white'
              : 'bg-surface border border-border text-primary'
          }`}
        >
          Certifications
        </Link>
        {pagesList.map((p) => (
          <div key={p.slug} className="flex items-center gap-1">
            <Link
              href={`/admin/pages?slug=${p.slug}`}
              className={`px-4 py-2 rounded-button text-sm font-medium ${
                slug === p.slug ? 'bg-primary text-white' : 'bg-surface border border-border text-primary'
              }`}
            >
              {p.title}
            </Link>
            {!SYSTEM_SLUGS.includes(p.slug) && (
              <button
                type="button"
                onClick={() => handleDeletePage(p.slug)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-button text-sm"
                title="Delete page"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <form onSubmit={handleAddPage} className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value)}
            placeholder="slug (e.g. gallery)"
            className="px-3 py-2 border border-border rounded-button bg-background text-sm w-28"
          />
          <input
            type="text"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="Page title"
            className="px-3 py-2 border border-border rounded-button bg-background text-sm w-36"
          />
          <button type="submit" disabled={addingPage} className="btn-cta px-3 py-2 text-sm">
            {addingPage ? 'Adding…' : 'Add page'}
          </button>
        </form>
      </div>

      {!page && !isCertificationsEditor && pagesList.length === 0 && (
        <p className="text-muted">No pages. Run db:seed or add a page above.</p>
      )}
      {!page && !isCertificationsEditor && <div className="max-w-2xl space-y-6" />}

      {isCertificationsEditor && certAboutReady && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-primary">Certifications</h2>
          {certAboutPage ? (
            <CertificationsEditor aboutPage={certAboutPage} />
          ) : (
            <p className="text-muted">Could not load the About page. Check the database or run seed.</p>
          )}
        </div>
      )}

      {!isCertificationsEditor && page && (
        <div className="space-y-6 max-w-2xl">
          {/* ——— HOME: Hero ——— */}
          {slug === 'home' && hero && (
            <div className="bg-surface rounded-card shadow-card p-6 border border-border">
              <h2 className="text-lg font-medium text-primary mb-4">Hero section</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Title</label>
                  <input
                    value={hero.title}
                    onChange={(e) =>
                      setPage((prev) =>
                        prev ? { ...prev, content: { ...prev.content, hero: { ...hero, title: e.target.value } } } : prev
                      )
                    }
                    className="w-full px-3 py-2 border border-border rounded-button bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Subtitles (one per line)</label>
                  <textarea
                    value={(hero.subtitles || []).join('\n')}
                    onChange={(e) =>
                      setPage((prev) =>
                        prev ? { ...prev, content: { ...prev.content, hero: { ...hero, subtitles: e.target.value.split('\n').filter(Boolean) } } } : prev
                      )
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-button bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">CTA text</label>
                    <input value={hero.ctaText} onChange={(e) => setPage((prev) => prev ? { ...prev, content: { ...prev.content, hero: { ...hero, ctaText: e.target.value } } } : prev)} className="w-full px-3 py-2 border border-border rounded-button bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">CTA link</label>
                    <input value={hero.ctaLink} onChange={(e) => setPage((prev) => prev ? { ...prev, content: { ...prev.content, hero: { ...hero, ctaLink: e.target.value } } } : prev)} className="w-full px-3 py-2 border border-border rounded-button bg-background" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ——— HOME: Sections (add / delete / reorder) ——— */}
          {slug === 'home' && (
            <div className="bg-surface rounded-card shadow-card p-6 border border-border">
              <h2 className="text-lg font-medium text-primary mb-4">Home sections (add, remove, reorder)</h2>
              <ul className="space-y-2 mb-4">
                {[...sections].sort((a, b) => a.order - b.order).map((s, idx) => (
                  <li key={s.id} className="flex items-center gap-3 flex-wrap">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={(e) =>
                        setPage((prev) => {
                          const cur = prev?.content?.sections as Section[] | undefined;
                          if (!prev || !cur) return prev;
                          return {
                            ...prev,
                            content: {
                              ...prev.content,
                              sections: cur.map((x) => (x.id === s.id ? { ...x, enabled: e.target.checked } : x)),
                            },
                          };
                        })
                      }
                    />
                    <span className="text-sm text-primary w-40">{s.type}</span>
                    {s.type === 'custom' && s.data && <span className="text-muted text-sm">{(s.data.title as string) || 'Untitled'}</span>}
                    <input
                      type="number"
                      value={s.order}
                      onChange={(e) =>
                        setPage((prev) => {
                          const cur = prev?.content?.sections as Section[] | undefined;
                          if (!prev || !cur) return prev;
                          return {
                            ...prev,
                            content: {
                              ...prev.content,
                              sections: cur.map((x) => (x.id === s.id ? { ...x, order: parseInt(e.target.value, 10) || 0 } : x)),
                            },
                          };
                        })
                      }
                      className="w-14 px-2 py-1 text-sm border border-border rounded bg-background"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPage((prev) => {
                          const cur = prev?.content?.sections as Section[] | undefined;
                          if (!prev || !cur) return prev;
                          return { ...prev, content: { ...prev.content, sections: cur.filter((x) => x.id !== s.id) } };
                        })
                      }
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <AddSectionForm
                onAdd={(type, data) => {
                  const id = 'sec-' + Date.now();
                  const order = sections.length ? Math.max(...sections.map((s) => s.order), 0) + 1 : 0;
                  setPage((prev) => ({
                    ...prev!,
                    content: {
                      ...prev!.content,
                      sections: [
                        ...((prev!.content.sections as Section[] | undefined) || []),
                        { id, type, enabled: true, order, data },
                      ],
                    },
                  }));
                }}
              />
            </div>
          )}

          {/* ——— ABOUT: bio, story, education, certifications, cvUrl ——— */}
          {slug === 'about' && (
            <div className="bg-surface rounded-card shadow-card p-6 border border-border">
              <h2 className="text-lg font-medium text-primary mb-4">About page content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Short bio</label>
                  <textarea
                    value={(page.content?.bio as string) || ''}
                    onChange={(e) => setPage((prev) => (prev ? { ...prev, content: { ...prev.content, bio: e.target.value } } : prev))}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-button bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Story (detailed)</label>
                  <textarea
                    value={(page.content?.story as string) || ''}
                    onChange={(e) => setPage((prev) => (prev ? { ...prev, content: { ...prev.content, story: e.target.value } } : prev))}
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-button bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Education (one per line: "Degree, Institution (Year)")</label>
                  <textarea
                    value={((page.content?.education as Array<{ name: string; year?: string }>) || []).map((e) => (e.year ? `${e.name} (${e.year})` : e.name)).join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(Boolean).map((line) => {
                        const match = line.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
                        return match ? { name: match[1].trim(), year: match[2].trim() } : { name: line.trim() };
                      });
                      setPage((prev) => (prev ? { ...prev, content: { ...prev.content, education: lines } } : prev));
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-button bg-background"
                    placeholder="B.Tech Geomatics, ABC University (2020)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Certifications</label>
                  <p className="text-sm text-muted mb-2">
                    Edit entries in the{' '}
                    <Link
                      href="/admin/pages?slug=certification"
                      className="text-primary underline font-medium"
                    >
                      Certifications
                    </Link>{' '}
                    tab—forms and image URLs, no JSON.
                  </p>
                  <p className="text-xs text-muted">
                    {normalizeCertifications(page.content.certifications).length} saved.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">About section visibility</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { key: 'showEducation', label: 'Show Education' },
                      { key: 'showCertifications', label: 'Show Certifications' },
                      { key: 'showExperience', label: 'Show Experience' },
                      { key: 'showSkills', label: 'Show Skills' },
                      { key: 'showCv', label: 'Show CV button' },
                    ].map((item) => (
                      <label key={item.key} className="inline-flex items-center gap-2 text-sm text-primary">
                        <input
                          type="checkbox"
                          checked={(page.content?.[item.key] as boolean | undefined) ?? true}
                          onChange={(e) =>
                            setPage((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    content: { ...prev.content, [item.key]: e.target.checked },
                                  }
                                : prev,
                            )
                          }
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">CV / Resume URL</label>
                  <input
                    value={(page.content?.cvUrl as string) || ''}
                    onChange={(e) => setPage((prev) => (prev ? { ...prev, content: { ...prev.content, cvUrl: e.target.value } } : prev))}
                    className="w-full px-3 py-2 border border-border rounded-button bg-background"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ——— CUSTOM PAGE: body (markdown) ——— */}
          {isCustomPage && (
            <>
              <div className="bg-surface rounded-card shadow-card p-6 border border-border">
                <h2 className="text-lg font-medium text-primary mb-4">Page content (Markdown)</h2>
                <textarea
                  value={(page.content?.body as string) || ''}
                  onChange={(e) => setPage((prev) => (prev ? { ...prev, content: { ...prev.content, body: e.target.value } } : prev))}
                  rows={14}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background font-mono text-sm"
                  placeholder="Write your page content in **Markdown**..."
                />
              </div>
              <div className="bg-surface rounded-card shadow-card p-6 border border-border">
                <h2 className="text-lg font-medium text-primary mb-4">Photos & videos</h2>
                <p className="text-sm text-muted mb-4">Add images or videos below the text. Use ↑ ↓ to set the order they appear on the page.</p>
                <ul className="space-y-3 mb-4">
                  {((page.content?.media as Array<{ type: string; url: string; caption?: string }>) || []).map((item, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-3 p-3 bg-background rounded-button border border-border">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setPage((prev) => {
                              const media = [...((prev?.content?.media as Array<{ type: string; url: string; caption?: string }>) || [])];
                              if (i <= 0) return prev;
                              [media[i - 1], media[i]] = [media[i], media[i - 1]];
                              return prev ? { ...prev, content: { ...prev.content, media } } : prev;
                            })
                          }
                          disabled={i === 0}
                          className="p-1 rounded border border-border text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPage((prev) => {
                              const media = [...((prev?.content?.media as Array<{ type: string; url: string; caption?: string }>) || [])];
                              if (i >= media.length - 1) return prev;
                              [media[i], media[i + 1]] = [media[i + 1], media[i]];
                              return prev ? { ...prev, content: { ...prev.content, media } } : prev;
                            })
                          }
                          disabled={i === ((page.content?.media as unknown[]) || []).length - 1}
                          className="p-1 rounded border border-border text-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                      <span className="text-sm font-medium text-primary capitalize w-14">{item.type}</span>
                      <input
                        value={item.url}
                        onChange={(e) =>
                          setPage((prev) => {
                            const media = [...((prev?.content?.media as Array<{ type: string; url: string; caption?: string }>) || [])];
                            media[i] = { ...media[i], url: e.target.value };
                            return prev ? { ...prev, content: { ...prev.content, media } } : prev;
                          })
                        }
                        className="flex-1 min-w-0 px-3 py-2 border border-border rounded-button bg-surface text-sm"
                        placeholder="URL"
                      />
                      <input
                        value={item.caption || ''}
                        onChange={(e) =>
                          setPage((prev) => {
                            const media = [...((prev?.content?.media as Array<{ type: string; url: string; caption?: string }>) || [])];
                            media[i] = { ...media[i], caption: e.target.value };
                            return prev ? { ...prev, content: { ...prev.content, media } } : prev;
                          })
                        }
                        className="w-32 px-3 py-2 border border-border rounded-button bg-surface text-sm"
                        placeholder="Caption"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPage((prev) => {
                            const media = ((prev?.content?.media as Array<unknown>) || []).filter((_, j) => j !== i);
                            return prev ? { ...prev, content: { ...prev.content, media } } : prev;
                          })
                        }
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) => ({
                        ...prev!,
                        content: {
                          ...prev!.content,
                          media: [...((prev!.content?.media as Array<unknown>) || []), { type: 'image', url: '', caption: '' }],
                        },
                      }))
                    }
                    className="px-3 py-2 border border-border rounded-button text-sm text-primary hover:bg-surface"
                  >
                    + Add image
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) => ({
                        ...prev!,
                        content: {
                          ...prev!.content,
                          media: [...((prev!.content?.media as Array<unknown>) || []), { type: 'video', url: '', caption: '' }],
                        },
                      }))
                    }
                    className="px-3 py-2 border border-border rounded-button text-sm text-primary hover:bg-surface"
                  >
                    + Add video
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ——— SEO (all pages) ——— */}
          <div className="bg-surface rounded-card shadow-card p-6 border border-border">
            <h2 className="text-lg font-medium text-primary mb-4">SEO</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">SEO title</label>
                <input
                  value={page.seoTitle ?? ''}
                  onChange={(e) => setPage((prev) => (prev ? { ...prev, seoTitle: e.target.value || null } : prev))}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">SEO description</label>
                <textarea
                  value={page.seoDesc ?? ''}
                  onChange={(e) => setPage((prev) => (prev ? { ...prev, seoDesc: e.target.value || null } : prev))}
                  rows={2}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background"
                />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-cta px-6 py-2.5 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminPagesPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-semibold text-primary mb-6">Pages</h1>
          <p className="text-muted">Loading…</p>
        </div>
      }
    >
      <AdminPagesPageContent />
    </Suspense>
  );
}

function AddSectionForm({ onAdd }: { onAdd: (type: string, data?: Record<string, unknown>) => void }) {
  const [type, setType] = useState('custom');
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (type === 'custom') {
      onAdd('custom', { title: customTitle, content: customContent });
      setCustomTitle('');
      setCustomContent('');
    } else if (type === 'image' || type === 'video') {
      onAdd(type, { url: mediaUrl, caption: mediaCaption });
      setMediaUrl('');
      setMediaCaption('');
    } else {
      onAdd(type);
    }
  }

  return (
    <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm font-medium text-muted mb-1">Section type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border border-border rounded-button bg-background text-sm">
          {SECTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      {(type === 'image' || type === 'video') && (
        <>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">{type === 'image' ? 'Image' : 'Video'} URL</label>
            <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder={type === 'video' ? 'YouTube, Vimeo, or direct video URL' : 'Image URL'} className="px-3 py-2 border border-border rounded-button bg-background text-sm w-64" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Caption (optional)</label>
            <input value={mediaCaption} onChange={(e) => setMediaCaption(e.target.value)} className="px-3 py-2 border border-border rounded-button bg-background text-sm w-40" />
          </div>
        </>
      )}
      {type === 'custom' && (
        <>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Title</label>
            <input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="px-3 py-2 border border-border rounded-button bg-background text-sm w-48" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Content (Markdown)</label>
            <textarea value={customContent} onChange={(e) => setCustomContent(e.target.value)} rows={2} className="px-3 py-2 border border-border rounded-button bg-background text-sm w-64" />
          </div>
        </>
      )}
      <button type="submit" className="btn-cta px-3 py-2 text-sm">Add section</button>
    </form>
  );
}
