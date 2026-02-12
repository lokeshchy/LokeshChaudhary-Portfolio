'use client'

import { useEffect } from 'react'

export default function SettingsProvider() {
  useEffect(() => {
    // Load settings and apply CSS variables
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const settings = data.data
          const root = document.documentElement
          
          if (settings.primaryColor) {
            root.style.setProperty('--color-primary', settings.primaryColor)
          }
          if (settings.accentColor) {
            root.style.setProperty('--color-accent', settings.accentColor)
          }
          if (settings.backgroundColor) {
            root.style.setProperty('--color-background', settings.backgroundColor)
          }
        }
      })
      .catch((err) => console.error('Error loading settings:', err))
  }, [])

  return null
}
