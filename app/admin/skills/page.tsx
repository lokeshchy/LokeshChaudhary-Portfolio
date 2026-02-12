'use client'

import { useEffect, useState } from 'react'
import type { Skill } from '@/types'

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      const data = await res.json()
      if (data.success) {
        setSkills(data.data)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchSkills()
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      icon: formData.get('icon') || undefined,
      order: parseInt(formData.get('order') as string) || 0,
    }

    try {
      const url = editing ? `/api/skills/${editing.id}` : '/api/skills'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        fetchSkills()
        setShowForm(false)
        setEditing(null)
      }
    } catch (error) {
      console.error('Error saving skill:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Skills</h1>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Add Skill
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-background border border-border rounded-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">
            {editing ? 'Edit' : 'Add'} Skill
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editing?.name}
                  required
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editing?.category}
                  required
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Icon (emoji or text)
                </label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editing?.icon}
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editing?.order || 0}
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Icon
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td className="px-6 py-4 text-sm text-foreground">
                  {skill.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {skill.category}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {skill.icon || '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setEditing(skill)
                      setShowForm(true)
                    }}
                    className="text-primary hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
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
