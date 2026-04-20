import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const updated = await prisma.skill.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(body.category !== undefined && { category: String(body.category) }),
      ...(body.icon !== undefined && { icon: body.icon ? String(body.icon) : null }),
      ...(body.order !== undefined && { order: Number(body.order) }),
    },
  });
  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    category: updated.category,
    icon: updated.icon,
    order: updated.order,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const { id } = await params;
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
