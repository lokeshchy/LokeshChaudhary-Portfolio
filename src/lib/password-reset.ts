import crypto from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env.server';
import { sendAuthEmail } from '@/lib/auth-mail';

const RESET_TTL_MS = 15 * 60 * 1000; // 15 minutes
const RESET_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MIN_PASSWORD_LEN = 10;

function hashResetToken(token: string) {
  return crypto
    .createHash('sha256')
    .update(`${token}|${env.otpSecret}`)
    .digest('hex');
}

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function requestPasswordReset(inputEmail: string): Promise<void> {
  const email = String(inputEmail || '').toLowerCase().trim();

  // Do not send to any destination except the configured receiver email.
  if (!email || email !== env.otpLoginEmail) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const latest = await prisma.passwordResetToken.findFirst({
    where: { userId: user.id, usedAt: null },
    orderBy: { createdAt: 'desc' },
  });
  if (latest && Date.now() - new Date(latest.createdAt).getTime() < RESET_COOLDOWN_MS) {
    return;
  }

  const rawToken = generateResetToken();
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const resetUrl = `${env.appUrl.replace(/\/+$/, '')}/admin/reset-password?token=${encodeURIComponent(rawToken)}`;
  await sendAuthEmail({
    to: env.otpLoginEmail,
    subject: 'Reset your admin password',
    text: `Use this link to reset your admin password: ${resetUrl}\n\nThis link expires in 15 minutes.`,
    html: `<p>Use this link to reset your admin password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`,
  });
}

export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const rawToken = String(token || '').trim();
  const password = String(newPassword || '');
  if (!rawToken || password.length < MIN_PASSWORD_LEN) return false;

  const tokenHash = hashResetToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.deleteMany({
      where: {
        userId: record.userId,
        id: { not: record.id },
      },
    }),
  ]);

  return true;
}
