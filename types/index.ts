// Database Models
export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Page {
  id: string
  slug: string
  title: string
  content: PageContent
  seoTitle?: string
  seoDesc?: string
  enabled: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface PageContent {
  sections: PageSection[]
}

export interface PageSection {
  id: string
  type: 'hero' | 'featured-projects' | 'about-preview' | 'skills' | 'experience-preview' | 'blogs' | 'cta' | 'custom'
  enabled: boolean
  order: number
  data: Record<string, any>
}

export interface HeroData {
  title: string
  subtitles: string[]
  ctaText: string
  ctaLink: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  tags: string[]
  published: boolean
  seoTitle?: string
  seoDesc?: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  slug: string
  overview: string
  problem?: string
  process?: string
  solution?: string
  result?: string
  techStack: string[]
  imageGallery: string[]
  featured: boolean
  order: number
  seoTitle?: string
  seoDesc?: string
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  id: string
  role: string
  organization: string
  location?: string
  startDate: Date
  endDate?: Date
  description: string[]
  type: 'Work' | 'Research' | 'Internship' | 'Volunteer'
  order: number
  visible: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Skill {
  id: string
  name: string
  category: string
  icon?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Setting {
  id: string
  key: string
  value: any
  createdAt: Date
  updatedAt: Date
}

export interface GlobalSettings {
  siteName: string
  logo?: string
  favicon?: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
  footerText: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
  }
  defaultSeoTitle?: string
  defaultSeoDesc?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
