'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  slug: string;
  overview: string;
  problem: string;
  process: string;
  solution: string;
  result: string;
  techStack: string[];
  imageGallery: string[];
  featured: boolean;
  deployed: boolean;
  demoUrl: string | null;
  viewCode: boolean;
  codeUrl: string | null;
  order: number;
};

export default function AdminProjectEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const [project, setProject] = useState<Project | null>(null);
  const [techStackDraft, setTechStackDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
      setProject({
        id: '',
        title: '',
        slug: '',
        overview: '',
        problem: '',
        process: '',
        solution: '',
        result: '',
        techStack: [],
        imageGallery: [],
        featured: false,
        deployed: false,
        demoUrl: null,
        viewCode: false,
        codeUrl: null,
        order: 0,
      });
      return;
    }
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then(setProject)
      .catch(() => setProject(null));
  }, [id, isNew]);

  useEffect(() => {
    if (!project) return;
    setTechStackDraft((project.techStack || []).join('\n'));
  }, [project?.id, project?.techStack]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;
    setSaving(true);
    const url = isNew ? '/api/projects' : `/api/projects/${id}`;
    const method = isNew ? 'POST' : 'PUT';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(() => router.push('/admin/projects'))
      .catch(() => alert('Failed to save'))
      .finally(() => setSaving(false));
  }

  function applyTechStackDraft() {
    const next = techStackDraft
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);
    setProject((p) => (p ? { ...p, techStack: next } : p));
  }

  if (!project) return <div className="text-muted">Loading...</div>;

  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-primary hover:underline mb-4 inline-block">
        ← Back to Projects
      </Link>
      <h1 className="text-2xl font-semibold text-primary mb-6">
        {isNew ? 'New project' : 'Edit project'}
      </h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Title</label>
            <input
              value={project.title}
              onChange={(e) =>
                setProject((p) =>
                  p ? { ...p, title: e.target.value, slug: p.slug || e.target.value.toLowerCase().replace(/\s+/g, '-') } : p
                )
              }
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Slug</label>
            <input
              value={project.slug}
              onChange={(e) => setProject((p) => (p ? { ...p, slug: e.target.value } : p))}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Overview</label>
          <textarea
            value={project.overview}
            onChange={(e) => setProject((p) => (p ? { ...p, overview: e.target.value } : p))}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        {['problem', 'process', 'solution', 'result'].map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-muted mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <textarea
              value={String((project as unknown as Record<string, string>)[key] ?? '')}
              onChange={(e) =>
                setProject((p) => (p ? { ...p, [key]: e.target.value } : p))
              }
              rows={2}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Tech stack (one per line)</label>
          <div className="space-y-2">
            <textarea
              value={techStackDraft}
              onChange={(e) => setTechStackDraft(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              placeholder={'React\nNode.js\nPostgreSQL'}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyTechStackDraft}
                className="px-3 py-1.5 text-xs rounded-button border border-primary/35 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Apply tech stack
              </button>
              <button
                type="button"
                onClick={() => {
                  setTechStackDraft('');
                  setProject((p) => (p ? { ...p, techStack: [] } : p));
                }}
                className="px-3 py-1.5 text-xs rounded-button border border-border text-muted hover:text-primary hover:border-primary/35 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {(project.techStack || []).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-button border border-secondary/35 bg-secondary/10 text-secondary"
                >
                  {t}
                </span>
              ))}
              {(project.techStack || []).length === 0 && (
                <span className="text-xs text-muted">No tech stack applied yet.</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Result images (URLs, one per line)</label>
          <p className="text-xs text-muted mb-1">
            These images appear on the project detail page under <strong>Result Images</strong>. Google Drive links are supported.
          </p>
          <textarea
            value={(project.imageGallery || []).join('\n')}
            onChange={(e) =>
              setProject((p) =>
                p ? { ...p, imageGallery: e.target.value.split('\n').filter(Boolean) } : p
              )
            }
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-button bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={project.featured}
            onChange={(e) => setProject((p) => (p ? { ...p, featured: e.target.checked } : p))}
          />
          <label htmlFor="featured" className="text-sm text-muted">
            Featured
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={project.deployed}
                onChange={(e) => setProject((p) => (p ? { ...p, deployed: e.target.checked } : p))}
              />
              <span className="text-sm text-muted">Deployed (show Demo button)</span>
            </label>
            <input
              value={project.demoUrl || ''}
              onChange={(e) => setProject((p) => (p ? { ...p, demoUrl: e.target.value || null } : p))}
              placeholder="https://your-live-project-url"
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              disabled={!project.deployed}
            />
          </div>
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={project.viewCode}
                onChange={(e) => setProject((p) => (p ? { ...p, viewCode: e.target.checked } : p))}
              />
              <span className="text-sm text-muted">View code available (show View Code button)</span>
            </label>
            <input
              value={project.codeUrl || ''}
              onChange={(e) => setProject((p) => (p ? { ...p, codeUrl: e.target.value || null } : p))}
              placeholder="https://github.com/username/repo"
              className="w-full px-3 py-2 border border-border rounded-button bg-background"
              disabled={!project.viewCode}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-cta px-6 py-2.5 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/admin/projects" className="px-6 py-2.5 border border-border rounded-button text-primary font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
