import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get('published') === 'true';
  const list = await prisma.blog.findMany({
    orderBy: { publishedAt: 'desc' },
    ...(publishedOnly ? { where: { published: true } } : {}),
  });
  return NextResponse.json(
    list.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      featuredImage: b.featuredImage,
      tags: JSON.parse(b.tags || '[]') as string[],
      published: b.published,
      seoTitle: b.seoTitle,
      seoDesc: b.seoDesc,
      publishedAt: b.publishedAt?.toISOString() ?? null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }))
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await request.json().catch(() => ({}));
  const created = await prisma.blog.create({
    data: {
      title: String(body.title ?? 'Untitled'),
      slug: String(body.slug ?? '').toLowerCase().replace(/\s+/g, '-') || 'untitled',
      content: String(body.content ?? ''),
      excerpt: body.excerpt ? String(body.excerpt) : null,
      featuredImage: body.featuredImage ? String(body.featuredImage) : null,
      tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
      published: Boolean(body.published),
      seoTitle: body.seoTitle ? String(body.seoTitle) : null,
      seoDesc: body.seoDesc ? String(body.seoDesc) : null,
      publishedAt: body.published ? new Date() : null,
    },
  });
  return NextResponse.json({
    id: created.id,
    title: created.title,
    slug: created.slug,
    content: created.content,
    excerpt: created.excerpt,
    featuredImage: created.featuredImage,
    tags: JSON.parse(created.tags || '[]'),
    published: created.published,
    seoTitle: created.seoTitle,
    seoDesc: created.seoDesc,
    publishedAt: created.publishedAt?.toISOString() ?? null,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
