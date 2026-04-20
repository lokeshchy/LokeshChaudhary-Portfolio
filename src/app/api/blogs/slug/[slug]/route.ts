import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({
    where: { slug },
  });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!post.published) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
