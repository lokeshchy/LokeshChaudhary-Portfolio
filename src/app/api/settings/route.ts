import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

const GLOBAL_KEY = 'global';

export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: GLOBAL_KEY } });
  if (!row) {
    return NextResponse.json({
      siteName: '',
      primaryColor: '#0a0a0a',
      accentColor: '#6366f1',
      backgroundColor: '#fafafa',
      footerText: '',
      socialLinks: {},
      defaultSeoTitle: '',
      defaultSeoDesc: '',
    });
  }
  const value = JSON.parse(row.value || '{}');
  return NextResponse.json(value);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  const body = await request.json().catch(() => ({}));
  const existing = await prisma.setting.findUnique({ where: { key: GLOBAL_KEY } });
  const current = existing ? JSON.parse(existing.value || '{}') : {};
  const merged = { ...current, ...body };
  await prisma.setting.upsert({
    where: { key: GLOBAL_KEY },
    update: { value: JSON.stringify(merged) },
    create: { key: GLOBAL_KEY, value: JSON.stringify(merged) },
  });
  return NextResponse.json(merged);
}
