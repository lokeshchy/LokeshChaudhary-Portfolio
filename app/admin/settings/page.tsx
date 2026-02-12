'use client'

import { useEffect, useState } from 'react'
import type { GlobalSettings } from '@/types'

export default function AdminSettings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const updates: Partial<GlobalSettings> = {
      siteName: formData.get('siteName') as string,
      logo: formData.get('logo') as string || undefined,
      favicon: formData.get('favicon') as string || undefined,
      primaryColor: formData.get('primaryColor') as string,
      accentColor: formData.get('accentColor') as string,
      backgroundColor: formData.get('backgroundColor') as string,
      footerText: formData.get('footerText') as string,
      socialLinks: {
        github: formData.get('github') as string || undefined,
        linkedin: formData.get('linkedin') as string || undefined,
        twitter: formData.get('twitter') as string || undefined,
        email: formData.get('email') as string || undefined,
      },
      defaultSeoTitle: formData.get('defaultSeoTitle') as string || undefined,
      defaultSeoDesc: formData.get('defaultSeoDesc') as string || undefined,
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                name="siteName"
                defaultValue={settings.siteName}
                required
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <input
                type="url"
                name="logo"
                defaultValue={settings.logo}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Favicon URL</label>
              <input
                type="url"
                name="favicon"
                defaultValue={settings.favicon}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Primary Color
              </label>
              <input
                type="color"
                name="primaryColor"
                defaultValue={settings.primaryColor}
                className="w-full h-10 border border-border rounded"
              />
              <input
                type="text"
                defaultValue={settings.primaryColor}
                onChange={(e) => {
                  const colorInput = e.target.form?.querySelector(
                    'input[name="primaryColor"]'
                  ) as HTMLInputElement
                  if (colorInput) colorInput.value = e.target.value
                }}
                className="w-full mt-2 px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Accent Color
              </label>
              <input
                type="color"
                name="accentColor"
                defaultValue={settings.accentColor}
                className="w-full h-10 border border-border rounded"
              />
              <input
                type="text"
                defaultValue={settings.accentColor}
                onChange={(e) => {
                  const colorInput = e.target.form?.querySelector(
                    'input[name="accentColor"]'
                  ) as HTMLInputElement
                  if (colorInput) colorInput.value = e.target.value
                }}
                className="w-full mt-2 px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Background Color
              </label>
              <input
                type="color"
                name="backgroundColor"
                defaultValue={settings.backgroundColor}
                className="w-full h-10 border border-border rounded"
              />
              <input
                type="text"
                defaultValue={settings.backgroundColor}
                onChange={(e) => {
                  const colorInput = e.target.form?.querySelector(
                    'input[name="backgroundColor"]'
                  ) as HTMLInputElement
                  if (colorInput) colorInput.value = e.target.value
                }}
                className="w-full mt-2 px-4 py-2 border border-border rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">Social Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                name="github"
                defaultValue={settings.socialLinks.github}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                defaultValue={settings.socialLinks.linkedin}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <input
                type="url"
                name="twitter"
                defaultValue={settings.socialLinks.twitter}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={settings.socialLinks.email}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Default SEO Title
              </label>
              <input
                type="text"
                name="defaultSeoTitle"
                defaultValue={settings.defaultSeoTitle}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Default SEO Description
              </label>
              <textarea
                name="defaultSeoDesc"
                defaultValue={settings.defaultSeoDesc}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-card p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4">Footer</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Footer Text</label>
            <textarea
              name="footerText"
              defaultValue={settings.footerText}
              rows={2}
              className="w-full px-4 py-2 border border-border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary text-white rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
