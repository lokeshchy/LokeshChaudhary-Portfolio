'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const SYSTEM_NAV: { slug: string; label: string; href: string }[] = [
  { slug: 'about', label: 'Resume', href: '/about' },
  { slug: 'projects', label: 'Projects', href: '/projects' },
  { slug: 'blog', label: 'Blog', href: '/blog' },
  { slug: 'certifications', label: 'Certifications', href: '/certifications' },
];
const SYSTEM_PAGE_SLUGS = new Set([
  'home',
  'about',
  'projects',
  'blog',
  'experience',
  'contact',
  'certifications',
  'certification',
]);

export function PublicHeader() {
  const pathname = usePathname();
  const [siteName, setSiteName] = useState('Portfolio');
  const [customPages, setCustomPages] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) => setSiteName(s.siteName || 'Portfolio'))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/pages')
      .then((r) => r.json())
      .then((pages: { slug: string; title: string }[]) => {
        setCustomPages(
          pages.filter(
            (p) =>
              !SYSTEM_PAGE_SLUGS.has(p.slug),
          ),
        );
      })
      .catch(() => {});
  }, []);

  const nav = [
    ...SYSTEM_NAV,
    ...customPages.map((p) => ({ slug: p.slug, label: p.title, href: `/${p.slug}` })),
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-frame mx-auto px-4 sm:px-6 flex h-14 items-center gap-3">
        <Link href="/" className="font-semibold text-gradient-primary shrink-0">
          {siteName}
        </Link>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <nav className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap justify-end min-w-max ml-auto pr-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-button transition-colors ${
                    active
                      ? 'text-primary bg-primary/10'
                      : 'text-muted hover:text-primary hover:bg-surface'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {active && <span className="text-foreground/90">(</span>}
                    <span>{item.label}</span>
                    {active && <span className="text-foreground/90">)</span>}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
