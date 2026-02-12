import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSettings } from '@/lib/settings'
import SettingsProvider from '@/components/SettingsProvider'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  
  return {
    title: settings.defaultSeoTitle || 'Portfolio',
    description: settings.defaultSeoDesc || 'Personal portfolio website',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary: ${settings.primaryColor || '#3b82f6'};
              --color-accent: ${settings.accentColor || '#8b5cf6'};
              --color-background: ${settings.backgroundColor || '#ffffff'};
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <SettingsProvider />
        {children}
      </body>
    </html>
  )
}
