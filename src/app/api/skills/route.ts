import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const list = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(
    list.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      icon: s.icon,
      order: s.order,
    }))
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await request.json().catch(() => ({}));
  const created = await prisma.skill.create({
    data: {
      name: String(body.name ?? ''),
      category: String(body.category ?? 'Other'),
      icon: body.icon ? String(body.icon) : null,
      order: Number(body.order) ?? 0,
    },
  });
  return NextResponse.json({
    id: created.id,
    name: created.name,
    category: created.category,
    icon: created.icon,
    order: created.order,
  });
}
