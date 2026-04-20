type NodeEnv = 'development' | 'test' | 'production';

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function requiredEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseBoolean(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return fallback;
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function assertMinLength(name: string, value: string, minLength: number) {
  if (value.length < minLength) {
    throw new Error(`${name} must be at least ${minLength} characters long`);
  }
}

const NODE_ENV = (readEnv('NODE_ENV') || 'development') as NodeEnv;
const JWT_SECRET = requiredEnv('JWT_SECRET');
const OTP_SECRET = requiredEnv('OTP_SECRET');

assertMinLength('JWT_SECRET', JWT_SECRET, 32);
assertMinLength('OTP_SECRET', OTP_SECRET, 32);

export const env = {
  nodeEnv: NODE_ENV,
  isProduction: NODE_ENV === 'production',

  databaseUrl: requiredEnv('DATABASE_URL'),
  appUrl: readEnv('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000',

  jwtSecret: JWT_SECRET,
  otpSecret: OTP_SECRET,
  otpLoginEmail: requiredEnv('OTP_LOGIN_EMAIL').toLowerCase(),

  smtp: {
    host: requiredEnv('SMTP_HOST'),
    port: parseNumber(readEnv('SMTP_PORT'), 587),
    secure: parseBoolean(readEnv('SMTP_SECURE')),
    user: requiredEnv('SMTP_USER'),
    pass: requiredEnv('SMTP_PASS'),
    from: requiredEnv('SMTP_FROM'),
  },
} as const;
