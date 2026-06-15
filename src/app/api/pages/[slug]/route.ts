import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

const SYSTEM_SLUGS = [
  'home',
  'about',
  'projects',
  'blog',
  'experience',
  'certifications',
  'certification',
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const content = JSON.parse(page.content);
  return NextResponse.json({
    id: page.id,
    slug: page.slug,
    title: page.title,
    content,
    seoTitle: page.seoTitle,
    seoDesc: page.seoDesc,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { slug } = await params;
  const body = await request.json();
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const updated = await prisma.page.update({
    where: { slug },
    data: {
      title: body.title ?? page.title,
      content: typeof body.content === 'string' ? body.content : JSON.stringify(body.content ?? {}),
      seoTitle: body.seoTitle ?? page.seoTitle,
      seoDesc: body.seoDesc ?? page.seoDesc,
    },
  });
  return NextResponse.json({
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    content: JSON.parse(updated.content),
    seoTitle: updated.seoTitle,
    seoDesc: updated.seoDesc,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { slug } = await params;
  if (SYSTEM_SLUGS.includes(slug)) {
    return NextResponse.json({ error: 'Cannot delete system page' }, { status: 400 });
  }
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.page.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
}
