import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: { slug: 'asc' },
    select: { id: true, slug: true, title: true },
  });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await request.json().catch(() => ({}));
  const slug = String(body.slug ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const title = String(body.title ?? 'Untitled');
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  const systemSlugs = ['home', 'about', 'projects', 'blog', 'experience'];
  if (systemSlugs.includes(slug)) return NextResponse.json({ error: 'Cannot create system page with this slug' }, { status: 400 });
  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 400 });
  const created = await prisma.page.create({
    data: {
      slug,
      title,
      content: JSON.stringify(body.content ?? { body: '' }),
    },
  });
  return NextResponse.json({
    id: created.id,
    slug: created.slug,
    title: created.title,
    content: JSON.parse(created.content),
  });
}
