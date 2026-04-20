import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = String(body.title);
  if (body.slug !== undefined) data.slug = String(body.slug).toLowerCase().replace(/\s+/g, '-');
  if (body.overview !== undefined) data.overview = String(body.overview);
  if (body.problem !== undefined) data.problem = body.problem ? String(body.problem) : null;
  if (body.process !== undefined) data.process = body.process ? String(body.process) : null;
  if (body.solution !== undefined) data.solution = body.solution ? String(body.solution) : null;
  if (body.result !== undefined) data.result = body.result ? String(body.result) : null;
  if (Array.isArray(body.techStack)) data.techStack = JSON.stringify(body.techStack);
  if (Array.isArray(body.imageGallery)) data.imageGallery = JSON.stringify(body.imageGallery);
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.deployed !== undefined) data.deployed = Boolean(body.deployed);
  if (body.demoUrl !== undefined) data.demoUrl = body.demoUrl ? String(body.demoUrl) : null;
  if (body.viewCode !== undefined) data.viewCode = Boolean(body.viewCode);
  if (body.codeUrl !== undefined) data.codeUrl = body.codeUrl ? String(body.codeUrl) : null;
  if (body.order !== undefined) data.order = Number(body.order);
  return data;
}

function serialize(p: {
  id: string;
  title: string;
  slug: string;
  overview: string;
  problem: string | null;
  process: string | null;
  solution: string | null;
  result: string | null;
  techStack: string;
  imageGallery: string;
  featured: boolean;
  deployed: boolean;
  demoUrl: string | null;
  viewCode: boolean;
  codeUrl: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    overview: p.overview,
    problem: p.problem,
    process: p.process,
    solution: p.solution,
    result: p.result,
    techStack: JSON.parse(p.techStack || '[]'),
    imageGallery: JSON.parse(p.imageGallery || '[]'),
    featured: p.featured,
    deployed: p.deployed,
    demoUrl: p.demoUrl,
    viewCode: p.viewCode,
    codeUrl: p.codeUrl,
    order: p.order,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  const byId = UUID_REGEX.test(param);
  const p = byId
    ? await prisma.project.findUnique({ where: { id: param } })
    : await prisma.project.findUnique({ where: { slug: param } });
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(serialize(p));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { param } = await params;
  if (!UUID_REGEX.test(param)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const body = await request.json().catch(() => ({}));
  const updated = await prisma.project.update({
    where: { id: param },
    data: toData(body),
  });
  return NextResponse.json(serialize(updated));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { param } = await params;
  if (!UUID_REGEX.test(param)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await prisma.project.delete({ where: { id: param } });
  return NextResponse.json({ ok: true });
}
