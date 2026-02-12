'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/pages', label: 'Pages', icon: '📄' },
  { href: '/admin/experience', label: 'Experience', icon: '💼' },
  { href: '/admin/projects', label: 'Projects', icon: '🚀' },
  { href: '/admin/blogs', label: 'Blogs', icon: '✍️' },
  { href: '/admin/skills', label: 'Skills', icon: '🛠️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()

      if (data.success) {
        setUser(data.data)
      } else {
        router.push('/admin/login')
      }
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    // Clear session cookie
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/5">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r border-border min-h-screen sticky top-0">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted mt-1">{user.email}</p>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:bg-muted/10 hover:text-foreground'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border mt-auto">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-muted hover:bg-muted/10 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
