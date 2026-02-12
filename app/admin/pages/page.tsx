'use client'

import { useEffect, useState } from 'react'
import type { Page, PageSection, HeroData } from '@/types'

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Page | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      // For now, we'll manage home page specifically
      const res = await fetch('/api/pages/home')
      const data = await res.json()
      if (data.success) {
        setPages([data.data])
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Build hero section data
    const heroData: HeroData = {
      title: formData.get('heroTitle') as string,
      subtitles: (formData.get('heroSubtitles') as string)
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s),
      ctaText: formData.get('heroCtaText') as string,
      ctaLink: formData.get('heroCtaLink') as string,
    }

    const sections: PageSection[] = [
      {
        id: 'hero',
        type: 'hero',
        enabled: formData.get('heroEnabled') === 'on',
        order: 0,
        data: heroData,
      },
      {
        id: 'featured-projects',
        type: 'featured-projects',
        enabled: formData.get('projectsEnabled') === 'on',
        order: 1,
        data: {},
      },
      {
        id: 'about-preview',
        type: 'about-preview',
        enabled: formData.get('aboutEnabled') === 'on',
        order: 2,
        data: {},
      },
      {
        id: 'skills',
        type: 'skills',
        enabled: formData.get('skillsEnabled') === 'on',
        order: 3,
        data: {},
      },
      {
        id: 'experience-preview',
        type: 'experience-preview',
        enabled: formData.get('experienceEnabled') === 'on',
        order: 4,
        data: {},
      },
      {
        id: 'blogs',
        type: 'blogs',
        enabled: formData.get('blogsEnabled') === 'on',
        order: 5,
        data: {},
      },
    ]

    const data = {
      title: formData.get('title') as string,
      content: { sections },
      seoTitle: formData.get('seoTitle') as string || undefined,
      seoDesc: formData.get('seoDesc') as string || undefined,
      enabled: formData.get('enabled') === 'on',
    }

    try {
      const res = await fetch('/api/pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        fetchPages()
        setShowForm(false)
        setEditing(null)
        alert('Page updated successfully!')
      }
    } catch (error) {
      console.error('Error saving page:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  const homePage = pages[0]
  const heroSection = homePage?.content.sections.find((s) => s.type === 'hero')
  const heroData = heroSection?.data as HeroData | undefined

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Pages</h1>
        <button
          onClick={() => {
            setEditing(homePage || null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Edit Home Page
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-background border border-border rounded-card p-6 shadow-soft max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Edit Home Page</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted/5 p-4 rounded">
              <h3 className="font-bold mb-4">General</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={homePage?.title}
                    required
                    className="w-full px-4 py-2 border border-border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      defaultValue={homePage?.seoTitle}
                      className="w-full px-4 py-2 border border-border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      SEO Description
                    </label>
                    <input
                      type="text"
                      name="seoDesc"
                      defaultValue={homePage?.seoDesc}
                      className="w-full px-4 py-2 border border-border rounded"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="enabled"
                    defaultChecked={homePage?.enabled ?? true}
                    className="w-4 h-4"
                  />
                  <label>Enabled</label>
                </div>
              </div>
            </div>

            <div className="bg-muted/5 p-4 rounded">
              <h3 className="font-bold mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="heroEnabled"
                    defaultChecked={heroSection?.enabled ?? true}
                    className="w-4 h-4"
                  />
                  <label>Enable Hero Section</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    name="heroTitle"
                    defaultValue={heroData?.title}
                    required
                    className="w-full px-4 py-2 border border-border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hero Subtitles (one per line - these will rotate)
                  </label>
                  <textarea
                    name="heroSubtitles"
                    defaultValue={heroData?.subtitles?.join('\n')}
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CTA Text
                    </label>
                    <input
                      type="text"
                      name="heroCtaText"
                      defaultValue={heroData?.ctaText}
                      className="w-full px-4 py-2 border border-border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      name="heroCtaLink"
                      defaultValue={heroData?.ctaLink}
                      className="w-full px-4 py-2 border border-border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/5 p-4 rounded">
              <h3 className="font-bold mb-4">Sections</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="projectsEnabled"
                    defaultChecked={
                      homePage?.content.sections.find(
                        (s) => s.type === 'featured-projects'
                      )?.enabled ?? true
                    }
                    className="w-4 h-4"
                  />
                  <span>Featured Projects</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="aboutEnabled"
                    defaultChecked={
                      homePage?.content.sections.find(
                        (s) => s.type === 'about-preview'
                      )?.enabled ?? true
                    }
                    className="w-4 h-4"
                  />
                  <span>About Preview</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="skillsEnabled"
                    defaultChecked={
                      homePage?.content.sections.find((s) => s.type === 'skills')
                        ?.enabled ?? true
                    }
                    className="w-4 h-4"
                  />
                  <span>Skills</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="experienceEnabled"
                    defaultChecked={
                      homePage?.content.sections.find(
                        (s) => s.type === 'experience-preview'
                      )?.enabled ?? true
                    }
                    className="w-4 h-4"
                  />
                  <span>Experience Preview</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="blogsEnabled"
                    defaultChecked={
                      homePage?.content.sections.find((s) => s.type === 'blogs')
                        ?.enabled ?? true
                    }
                    className="w-4 h-4"
                  />
                  <span>Latest Blogs</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
              >
                Update Page
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditing(null)
                }}
                className="px-4 py-2 border border-border rounded hover:bg-muted/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-background border border-border rounded-card overflow-hidden shadow-soft">
        <table className="w-full">
          <thead className="bg-muted/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Page
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="px-6 py-4 text-sm text-foreground">
                  {page.title}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {page.enabled ? 'Enabled' : 'Disabled'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setEditing(page)
                      setShowForm(true)
                    }}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
