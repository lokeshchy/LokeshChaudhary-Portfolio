'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    blogs: number;
    projects: number;
    experience: number;
    skills: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/blogs').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/experience?all=true').then((r) => r.json()).catch(() => []),
      fetch('/api/skills').then((r) => r.json()),
    ])
      .then(([blogs, projects, experience, skills]) => {
        setStats({
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          experience: Array.isArray(experience) ? experience.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
        });
      })
      .catch(() => setStats({ blogs: 0, projects: 0, experience: 0, skills: 0 }));
  }, []);

  const cards = [
    { label: 'Blog posts', value: stats?.blogs ?? '—', href: '/admin/blogs' },
    { label: 'Projects', value: stats?.projects ?? '—', href: '/admin/projects' },
    { label: 'Experience entries', value: stats?.experience ?? '—', href: '/admin/experience' },
    { label: 'Skills', value: stats?.skills ?? '—', href: '/admin/skills' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary mb-2">Dashboard</h1>
      <p className="text-muted mb-8">Overview of your portfolio content.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-surface rounded-card shadow-card p-6 border border-border hover:shadow-lg transition-shadow"
          >
            <p className="text-muted text-sm">{c.label}</p>
            <p className="text-2xl font-semibold text-primary mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 bg-surface rounded-card shadow-card p-6 border border-border">
        <h2 className="text-lg font-medium text-primary mb-2">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/pages?slug=home"
            className="btn-cta px-4 py-2 text-sm font-medium"
          >
            Edit Home page
          </Link>
          <Link
            href="/admin/experience"
            className="px-4 py-2 border border-border text-primary text-sm font-medium rounded-button hover:bg-surface"
          >
            Manage Experience
          </Link>
          <Link
            href="/admin/blogs"
            className="px-4 py-2 border border-border text-primary text-sm font-medium rounded-button hover:bg-surface"
          >
            New blog post
          </Link>
        </div>
      </div>
    </div>
  );
}
