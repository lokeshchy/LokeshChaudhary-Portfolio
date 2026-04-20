import { prisma } from '@/lib/db';

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

export async function getExperienceList() {
  const list = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { startDate: 'desc' },
  });
  return list.map((e) => ({
    ...e,
    description: JSON.parse(e.description || '[]') as string[],
  }));
}

export async function getProjectsList() {
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

export async function getBlogList(publishedOnly = true) {
  const list = await prisma.blog.findMany({
    orderBy: { publishedAt: 'desc' },
    ...(publishedOnly ? { where: { published: true } } : {}),
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

export async function getSkillsList() {
  return prisma.skill.findMany({ orderBy: { order: 'asc' } });
}
