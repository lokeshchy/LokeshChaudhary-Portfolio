import { prisma } from './prisma'
import { parseJson, stringifyJson } from './utils'
import type { GlobalSettings } from '@/types'

const DEFAULT_SETTINGS: GlobalSettings = {
  siteName: 'Portfolio',
  primaryColor: '#3b82f6',
  accentColor: '#8b5cf6',
  backgroundColor: '#ffffff',
  footerText: '© 2024 Portfolio. All rights reserved.',
  socialLinks: {},
}

export async function getSettings(): Promise<GlobalSettings> {
  try {
    const settings = await prisma.setting.findMany()
    const settingsMap = new Map(settings.map(s => [s.key, s.value]))
    
    return {
      siteName: parseJson(settingsMap.get('siteName'), DEFAULT_SETTINGS.siteName),
      logo: parseJson(settingsMap.get('logo'), DEFAULT_SETTINGS.logo),
      favicon: parseJson(settingsMap.get('favicon'), DEFAULT_SETTINGS.favicon),
      primaryColor: parseJson(settingsMap.get('primaryColor'), DEFAULT_SETTINGS.primaryColor),
      accentColor: parseJson(settingsMap.get('accentColor'), DEFAULT_SETTINGS.accentColor),
      backgroundColor: parseJson(settingsMap.get('backgroundColor'), DEFAULT_SETTINGS.backgroundColor),
      footerText: parseJson(settingsMap.get('footerText'), DEFAULT_SETTINGS.footerText),
      socialLinks: parseJson(settingsMap.get('socialLinks'), DEFAULT_SETTINGS.socialLinks),
      defaultSeoTitle: parseJson(settingsMap.get('defaultSeoTitle'), DEFAULT_SETTINGS.defaultSeoTitle),
      defaultSeoDesc: parseJson(settingsMap.get('defaultSeoDesc'), DEFAULT_SETTINGS.defaultSeoDesc),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function updateSettings(updates: Partial<GlobalSettings>): Promise<void> {
  for (const [key, value] of Object.entries(updates)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: stringifyJson(value) },
      create: { key, value: stringifyJson(value) },
    })
  }
}
