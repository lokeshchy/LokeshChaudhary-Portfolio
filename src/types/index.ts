// Page & CMS
export interface HeroContent {
  title: string;
  subtitles: string[];
  ctaText: string;
  ctaLink: string;
}

export type SectionType =
  | 'hero'
  | 'featured-projects'
  | 'about-preview'
  | 'skills-snapshot'
  | 'experience-preview'
  | 'latest-blogs'
  | 'cta';

export interface PageSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  data: Record<string, unknown>;
}

export interface PageContent {
  sections: PageSection[];
  hero?: HeroContent;
}

/** About page certifications — string for simple one-line entries, or structured object */
export interface CertificationEntry {
  title: string;
  issuer?: string;
  issued?: string;
  credentialId?: string;
  skills?: string;
  /** HTTPS image URL (e.g. Google Drive share link). Not stored in repo. */
  image?: string;
}

export type CertificationItem = string | CertificationEntry;

// Experience
export type ExperienceType = 'Work' | 'Research' | 'Internship' | 'Volunteer';
export type WorkMode = 'Onsite' | 'Hybrid' | 'Remote';

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  location?: string;
  workMode?: WorkMode | string | null;
  startDate: string;
  endDate: string;
  description: string[];
  type: ExperienceType;
  order: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Blog
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags: string[];
  published: boolean;
  seoTitle?: string;
  seoDesc?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Project
export interface ProjectEntry {
  id: string;
  title: string;
  slug: string;
  overview: string;
  problem?: string;
  process?: string;
  solution?: string;
  result?: string;
  techStack: string[];
  imageGallery: string[];
  featured: boolean;
  deployed: boolean;
  demoUrl?: string;
  viewCode: boolean;
  codeUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Skill
export interface SkillEntry {
  id: string;
  name: string;
  category: string;
  icon?: string;
  order: number;
}

// Settings
export interface GlobalSettings {
  siteName: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  footerText?: string;
  socialLinks: Record<string, string>;
  defaultSeoTitle?: string;
  defaultSeoDesc?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
