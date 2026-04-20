import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const list = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(
    list.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      overview: p.overview,
      problem: p.problem,
      process: p.process,
      solution: p.solution,
      result: p.result,
      techStack: JSON.parse(p.techStack || '[]') as string[],
      imageGallery: JSON.parse(p.imageGallery || '[]') as string[],
      featured: p.featured,
      deployed: p.deployed,
      demoUrl: p.demoUrl,
      viewCode: p.viewCode,
      codeUrl: p.codeUrl,
      order: p.order,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await request.json().catch(() => ({}));
  const slug = String(body.slug ?? body.title ?? 'project').toLowerCase().replace(/\s+/g, '-');
  const created = await prisma.project.create({
    data: {
      title: String(body.title ?? 'Untitled'),
      slug: slug || 'project',
      overview: String(body.overview ?? ''),
      problem: body.problem ? String(body.problem) : null,
      process: body.process ? String(body.process) : null,
      solution: body.solution ? String(body.solution) : null,
      result: body.result ? String(body.result) : null,
      techStack: JSON.stringify(Array.isArray(body.techStack) ? body.techStack : []),
      imageGallery: JSON.stringify(Array.isArray(body.imageGallery) ? body.imageGallery : []),
      featured: Boolean(body.featured),
      deployed: Boolean(body.deployed),
      demoUrl: body.demoUrl ? String(body.demoUrl) : null,
      viewCode: Boolean(body.viewCode),
      codeUrl: body.codeUrl ? String(body.codeUrl) : null,
      order: Number(body.order) ?? 0,
    },
  });
  return NextResponse.json({
    id: created.id,
    title: created.title,
    slug: created.slug,
    overview: created.overview,
    problem: created.problem,
    process: created.process,
    solution: created.solution,
    result: created.result,
    techStack: JSON.parse(created.techStack || '[]'),
    imageGallery: JSON.parse(created.imageGallery || '[]'),
    featured: created.featured,
    deployed: created.deployed,
    demoUrl: created.demoUrl,
    viewCode: created.viewCode,
    codeUrl: created.codeUrl,
    order: created.order,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
