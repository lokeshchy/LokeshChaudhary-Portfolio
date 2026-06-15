import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';
import { parseWorkMode } from '@/lib/experience-constants';

function parseExperience(body: Record<string, unknown>) {
  return {
    role: body.role !== undefined ? String(body.role) : undefined,
    organization: body.organization !== undefined ? String(body.organization) : undefined,
    location: body.location !== undefined ? (body.location ? String(body.location) : null) : undefined,
    workMode: body.workMode !== undefined ? parseWorkMode(body.workMode) : undefined,
    startDate: body.startDate !== undefined ? String(body.startDate) : undefined,
    endDate: body.endDate !== undefined ? String(body.endDate) : undefined,
    description: Array.isArray(body.description) ? JSON.stringify(body.description) : undefined,
    type: body.type !== undefined ? String(body.type) : undefined,
    order: body.order !== undefined ? Number(body.order) : undefined,
    visible: body.visible !== undefined ? Boolean(body.visible) : undefined,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const e = await prisma.experience.findUnique({ where: { id } });
  if (!e) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    id: e.id,
    role: e.role,
    organization: e.organization,
    location: e.location,
    workMode: e.workMode,
    startDate: e.startDate,
    endDate: e.endDate,
    description: JSON.parse(e.description || '[]'),
    type: e.type,
    order: e.order,
    visible: e.visible,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
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
  const data = parseExperience(body);
  const updated = await prisma.experience.update({
    where: { id },
    data: Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)),
  });
  return NextResponse.json({
    id: updated.id,
    role: updated.role,
    organization: updated.organization,
    location: updated.location,
    workMode: updated.workMode,
    startDate: updated.startDate,
    endDate: updated.endDate,
    description: JSON.parse(updated.description || '[]'),
    type: updated.type,
    order: updated.order,
    visible: updated.visible,
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
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
