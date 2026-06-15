'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const SYSTEM_NAV: { slug: string; label: string; href: string }[] = [
  { slug: 'about', label: 'Resume', href: '/about' },
  { slug: 'projects', label: 'Projects', href: '/projects' },
  { slug: 'blog', label: 'Blog', href: '/blog' },
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
  const [scrolled, setScrolled] = useState(false);

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
        setCustomPages(pages.filter((p) => !SYSTEM_PAGE_SLUGS.has(p.slug)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    ...SYSTEM_NAV,
    ...customPages.map((p) => ({ slug: p.slug, label: p.title, href: `/${p.slug}` })),
  ];

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(7, 12, 24, 0.88)'
          : 'rgba(7, 12, 24, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(45, 212, 191, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 flex h-16 items-center">
        {/* Logo / site name */}
        <Link href="/" className="shrink-0 mr-8">
          <span className="font-bold text-base tracking-tight text-gradient-primary">
            {siteName}
          </span>
        </Link>

        {/* Separator dot */}
        <span className="hidden sm:block w-1 h-1 rounded-full bg-[rgba(45,212,191,0.3)] mr-8 shrink-0" aria-hidden />

        {/* Nav */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          <nav className="flex items-center gap-0.5 justify-end whitespace-nowrap min-w-max ml-auto">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 group"
                  style={{
                    color: active ? '#2dd4bf' : '#64748b',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#64748b';
                  }}
                >
                  {/* Active indicator */}
                  {active && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'rgba(45, 212, 191, 0.08)',
                        border: '1px solid rgba(45, 212, 191, 0.18)',
                      }}
                    />
                  )}
                  {/* Hover bg */}
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: active ? 'transparent' : 'rgba(255, 255, 255, 0.04)' }}
                    aria-hidden
                  />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
