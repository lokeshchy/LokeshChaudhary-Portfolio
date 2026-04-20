import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

function toData(body: Record<string, unknown>) {
  return {
    title: body.title !== undefined ? String(body.title) : undefined,
    slug: body.slug !== undefined ? String(body.slug).toLowerCase().replace(/\s+/g, '-') : undefined,
    content: body.content !== undefined ? String(body.content) : undefined,
    excerpt: body.excerpt !== undefined ? (body.excerpt ? String(body.excerpt) : null) : undefined,
    featuredImage: body.featuredImage !== undefined ? (body.featuredImage ? String(body.featuredImage) : null) : undefined,
    tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : undefined,
    published: body.published !== undefined ? Boolean(body.published) : undefined,
    seoTitle: body.seoTitle !== undefined ? (body.seoTitle ? String(body.seoTitle) : null) : undefined,
    seoDesc: body.seoDesc !== undefined ? (body.seoDesc ? String(body.seoDesc) : null) : undefined,
    publishedAt: body.published === true ? new Date() : body.published === false ? null : undefined,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.blog.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    tags: JSON.parse(post.tags || '[]'),
    published: post.published,
    seoTitle: post.seoTitle,
    seoDesc: post.seoDesc,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const data = toData(body);
  const updated = await prisma.blog.update({
    where: { id },
    data: Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)),
  });
  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    slug: updated.slug,
    content: updated.content,
    excerpt: updated.excerpt,
    featuredImage: updated.featuredImage,
    tags: JSON.parse(updated.tags || '[]'),
    published: updated.published,
    seoTitle: updated.seoTitle,
    seoDesc: updated.seoDesc,
    publishedAt: updated.publishedAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { id } = await params;
  await prisma.blog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
