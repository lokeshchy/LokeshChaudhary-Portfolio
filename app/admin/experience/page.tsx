'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { Experience } from '@/types'

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience')
      const data = await res.json()
      if (data.success) {
        setExperiences(data.data)
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchExperiences()
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      role: formData.get('role'),
      organization: formData.get('organization'),
      location: formData.get('location') || undefined,
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate') || undefined,
      description: (formData.get('description') as string)
        .split('\n')
        .filter((line) => line.trim()),
      type: formData.get('type'),
      order: parseInt(formData.get('order') as string) || 0,
      visible: formData.get('visible') === 'on',
    }

    try {
      const url = editing
        ? `/api/experience/${editing.id}`
        : '/api/experience'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        fetchExperiences()
        setShowForm(false)
        setEditing(null)
      }
    } catch (error) {
      console.error('Error saving experience:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Experience</h1>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Add Experience
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-background border border-border rounded-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">
            {editing ? 'Edit' : 'Add'} Experience
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  defaultValue={editing?.role}
                  required
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  defaultValue={editing?.organization}
                  required
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                defaultValue={editing?.location}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={
                    editing
                      ? format(new Date(editing.startDate), 'yyyy-MM-dd')
                      : ''
                  }
                  required
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date (leave empty for present)
                </label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={
                    editing?.endDate
                      ? format(new Date(editing.endDate), 'yyyy-MM-dd')
                      : ''
                  }
                  className="w-full px-4 py-2 border border-border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                name="type"
                defaultValue={editing?.type}
                required
                className="w-full px-4 py-2 border border-border rounded"
              >
                <option value="Work">Work</option>
                <option value="Research">Research</option>
                <option value="Internship">Internship</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (one per line)
              </label>
              <textarea
                name="description"
                defaultValue={editing?.description?.join('\n')}
                rows={5}
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
                    name="visible"
                    defaultChecked={editing?.visible ?? true}
                    className="w-4 h-4"
                  />
                  <span>Visible</span>
                </label>
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
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Period
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td className="px-6 py-4 text-sm text-foreground">
                  {exp.role}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {exp.organization}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                  {exp.endDate
                    ? format(new Date(exp.endDate), 'MMM yyyy')
                    : 'Present'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setEditing(exp)
                      setShowForm(true)
                    }}
                    className="text-primary hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
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
