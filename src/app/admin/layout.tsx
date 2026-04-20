'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const nav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Pages', href: '/admin/pages' },
  { label: 'Experience', href: '/admin/experience' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Blogs', href: '/admin/blogs' },
  { label: 'Skills', href: '/admin/skills' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 fixed left-0 top-0 h-full bg-surface border-r border-border shadow-soft flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="text-lg font-semibold text-primary">
            Admin CMS
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-button text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-surface hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-button text-sm text-muted hover:bg-background hover:text-primary"
          >
            View site →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-button text-sm text-red-600 hover:bg-red-500/10"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
