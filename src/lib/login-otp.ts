import crypto from 'node:crypto';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env.server';
import { sendAuthEmail } from '@/lib/auth-mail';

const OTP_KEY_PREFIX = 'auth_otp:';
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RESEND_COOLDOWN_MS = 45 * 1000; // 45 seconds
const OTP_MAX_ATTEMPTS = 5;

type OtpStore = {
  hash: string;
  expiresAt: string;
  attempts: number;
  lastSentAt: string;
};

function otpKey(email: string) {
  return `${OTP_KEY_PREFIX}${email.toLowerCase()}`;
}

function otpSecret() {
  return env.otpSecret;
}

function hashOtp(email: string, code: string) {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}|${code}|${otpSecret()}`)
    .digest('hex');
}

function generateOtpCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function issueAndSendOtp(email: string): Promise<void> {
  const key = otpKey(email);
  const existing = await prisma.setting.findUnique({ where: { key } });
  if (existing?.value) {
    const parsed = JSON.parse(existing.value) as OtpStore;
    const sinceLast = Date.now() - new Date(parsed.lastSentAt).getTime();
    if (Number.isFinite(sinceLast) && sinceLast < OTP_RESEND_COOLDOWN_MS) {
      throw new Error('OTP recently sent. Please wait a few seconds.');
    }
  }

  const code = generateOtpCode();
  const now = Date.now();
  const payload: OtpStore = {
    hash: hashOtp(email, code),
    expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
    attempts: 0,
    lastSentAt: new Date(now).toISOString(),
  };

  await prisma.setting.upsert({
    where: { key },
    update: { value: JSON.stringify(payload) },
    create: { key, value: JSON.stringify(payload) },
  });

  await sendAuthEmail({
    to: email,
    subject: 'Your admin login OTP',
    text: `Your OTP is ${code}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <strong style="font-size:20px;letter-spacing:2px;">${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const key = otpKey(email);
  const record = await prisma.setting.findUnique({ where: { key } });
  if (!record?.value) return false;

  let parsed: OtpStore;
  try {
    parsed = JSON.parse(record.value) as OtpStore;
  } catch {
    await prisma.setting.delete({ where: { key } }).catch(() => undefined);
    return false;
  }

  if (new Date(parsed.expiresAt).getTime() < Date.now() || parsed.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.setting.delete({ where: { key } }).catch(() => undefined);
    return false;
  }

  const ok = crypto.timingSafeEqual(
    Buffer.from(parsed.hash, 'utf8'),
    Buffer.from(hashOtp(email, code), 'utf8')
  );

  if (!ok) {
    const attempts = parsed.attempts + 1;
    if (attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.setting.delete({ where: { key } }).catch(() => undefined);
    } else {
      await prisma.setting.update({
        where: { key },
        data: { value: JSON.stringify({ ...parsed, attempts }) },
      });
    }
    return false;
  }

  await prisma.setting.delete({ where: { key } }).catch(() => undefined);
  return true;
}
