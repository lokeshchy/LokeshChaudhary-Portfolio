import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';
import { getSession } from '@/lib/auth';
import { parseWorkMode } from '@/lib/experience-constants';

function parseExperience(body: Record<string, unknown>) {
  return {
    role: String(body.role ?? ''),
    organization: String(body.organization ?? ''),
    location: body.location ? String(body.location) : null,
    workMode: parseWorkMode(body.workMode),
    startDate: String(body.startDate ?? ''),
    endDate: String(body.endDate ?? 'Present'),
    description: Array.isArray(body.description) ? JSON.stringify(body.description) : JSON.stringify([]),
    type: String(body.type ?? 'Work'),
    order: Number(body.order) ?? 0,
    visible: body.visible !== false,
  };
}

export async function GET(_request: NextRequest) {
  const session = await getSession();
  const showAll = !!session;
  const list = await prisma.experience.findMany({
    orderBy: { startDate: 'desc' },
    ...(showAll ? {} : { where: { visible: true } }),
  });
  return NextResponse.json(
    list.map((e) => ({
      id: e.id,
      role: e.role,
      organization: e.organization,
      location: e.location,
      workMode: e.workMode,
      startDate: e.startDate,
      endDate: e.endDate,
      description: JSON.parse(e.description || '[]') as string[],
      type: e.type,
      order: e.order,
      visible: e.visible,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }))
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await request.json().catch(() => ({}));
  const data = parseExperience(body);
  const created = await prisma.experience.create({ data });
  return NextResponse.json({
    id: created.id,
    role: created.role,
    organization: created.organization,
    location: created.location,
    workMode: created.workMode,
    startDate: created.startDate,
    endDate: created.endDate,
    description: JSON.parse(created.description || '[]'),
    type: created.type,
    order: created.order,
    visible: created.visible,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
