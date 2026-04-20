import type { Experience, Project, Blog, Skill } from '@prisma/client';
import { prisma } from '@/lib/db';

export type ExperienceItem = Omit<Experience, 'description'> & { description: string[] };
export type ProjectItem = Omit<Project, 'techStack' | 'imageGallery'> & { techStack: string[]; imageGallery: string[] };
export type BlogItem = Omit<Blog, 'tags'> & { tags: string[] };
export type SkillItem = Skill;

export async function getPageBySlug(slug: string) {
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return null;
  return {
    ...page,
    content: JSON.parse(page.content || '{}'),
  };
}

export async function getSettings() {
  const row = await prisma.setting.findUnique({ where: { key: 'global' } });
  if (!row) return null;
  return JSON.parse(row.value || '{}');
}

export async function getExperienceList(): Promise<ExperienceItem[]> {
  const list = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { startDate: 'desc' },
  });
  return list.map((e) => ({
    ...e,
    description: JSON.parse(e.description || '[]') as string[],
  }));
}

export async function getProjectsList(): Promise<ProjectItem[]> {
  const list = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  return list.map((p) => ({
    ...p,
    techStack: JSON.parse(p.techStack || '[]') as string[],
    imageGallery: JSON.parse(p.imageGallery || '[]') as string[],
  }));
}

export async function getProjectBySlug(slug: string) {
  const p = await prisma.project.findUnique({ where: { slug } });
  if (!p) return null;
  return {
    ...p,
    techStack: JSON.parse(p.techStack || '[]') as string[],
    imageGallery: JSON.parse(p.imageGallery || '[]') as string[],
  };
}

export async function getBlogList(publishedOnly = true): Promise<BlogItem[]> {
  const list = await prisma.blog.findMany({
    orderBy: { publishedAt: 'desc' },
    where: publishedOnly ? { published: true } : undefined,
  });
  return list.map((b) => ({
    ...b,
    tags: JSON.parse(b.tags || '[]') as string[],
  }));
}

export async function getBlogBySlug(slug: string) {
  const b = await prisma.blog.findUnique({ where: { slug } });
  if (!b || !b.published) return null;
  return {
    ...b,
    tags: JSON.parse(b.tags || '[]') as string[],
  };
}

export async function getSkillsList(): Promise<SkillItem[]> {
  return prisma.skill.findMany({ orderBy: { order: 'asc' } });
}
