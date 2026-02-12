'use client'

import { useEffect, useState } from 'react'
import type { Project } from '@/types'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      overview: formData.get('overview'),
      problem: formData.get('problem') || undefined,
      process: formData.get('process') || undefined,
      solution: formData.get('solution') || undefined,
      result: formData.get('result') || undefined,
      techStack: (formData.get('techStack') as string)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      imageGallery: (formData.get('imageGallery') as string)
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s),
      featured: formData.get('featured') === 'on',
      order: parseInt(formData.get('order') as string) || 0,
      seoTitle: formData.get('seoTitle') || undefined,
      seoDesc: formData.get('seoDesc') || undefined,
    }

    try {
      const url = editing ? `/api/projects/${editing.id}` : '/api/projects'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        fetchProjects()
        setShowForm(false)
        setEditing(null)
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-background border border-border rounded-card p-6 shadow-soft max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {editing ? 'Edit' : 'Add'} Project
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
              <label className="block text-sm font-medium mb-2">Overview</label>
              <textarea
                name="overview"
                defaultValue={editing?.overview}
                required
                rows={3}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Problem</label>
              <textarea
                name="problem"
                defaultValue={editing?.problem}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Process</label>
              <textarea
                name="process"
                defaultValue={editing?.process}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Solution</label>
              <textarea
                name="solution"
                defaultValue={editing?.solution}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Result</label>
              <textarea
                name="result"
                defaultValue={editing?.result}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                name="techStack"
                defaultValue={editing?.techStack?.join(', ')}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image Gallery URLs (one per line)
              </label>
              <textarea
                name="imageGallery"
                defaultValue={editing?.imageGallery?.join('\n')}
                rows={4}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editing?.order || 0}
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editing?.featured ?? false}
                    className="w-4 h-4"
                  />
                  <span>Featured</span>
                </label>
              </div>
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
                Slug
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 text-sm text-foreground">
                  {project.title}
                </td>
                <td className="px-6 py-4 text-sm text-muted">{project.slug}</td>
                <td className="px-6 py-4 text-sm text-muted">
                  {project.featured ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setEditing(project)
                      setShowForm(true)
                    }}
                    className="text-primary hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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
