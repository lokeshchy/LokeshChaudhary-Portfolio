'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { Blog } from '@/types'

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      const data = await res.json()
      if (data.success) {
        setBlogs(data.data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt') || undefined,
      featuredImage: formData.get('featuredImage') || undefined,
      tags: (formData.get('tags') as string)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      published: formData.get('published') === 'on',
      seoTitle: formData.get('seoTitle') || undefined,
      seoDesc: formData.get('seoDesc') || undefined,
    }

    try {
      const url = editing ? `/api/blogs/${editing.id}` : '/api/blogs'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        fetchBlogs()
        setShowForm(false)
        setEditing(null)
      }
    } catch (error) {
      console.error('Error saving blog:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Blogs</h1>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Add Blog
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-background border border-border rounded-card p-6 shadow-soft max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {editing ? 'Edit' : 'Add'} Blog
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editing?.title}
                  required
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editing?.slug}
                  required
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                name="excerpt"
                defaultValue={editing?.excerpt}
                rows={2}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
              <textarea
                name="content"
                defaultValue={editing?.content}
                required
                rows={15}
                className="w-full px-4 py-2 border border-border rounded font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                name="featuredImage"
                defaultValue={editing?.featuredImage}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                defaultValue={editing?.tags?.join(', ')}
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
                  defaultValue={editing?.seoTitle}
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
                  defaultValue={editing?.seoDesc}
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                defaultChecked={editing?.published ?? false}
                className="w-4 h-4"
              />
              <label>Published</label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
              >
                {editing ? 'Update' : 'Create'}
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
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Published
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="px-6 py-4 text-sm text-foreground">
                  {blog.title}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {blog.published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-muted">Draft</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {blog.publishedAt
                    ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setEditing(blog)
                      setShowForm(true)
                    }}
                    className="text-primary hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
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
