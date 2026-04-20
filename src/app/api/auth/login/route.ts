import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createToken, setAuthCookie } from '@/lib/auth';
import { issueAndSendOtp, verifyOtp } from '@/lib/login-otp';
import { env } from '@/lib/env.server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, otp } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const normalizedEmail = String(email).toLowerCase();
    const allowedOtpEmail = env.otpLoginEmail;

    if (normalizedEmail !== allowedOtpEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!otp) {
      await issueAndSendOtp(normalizedEmail);
      return NextResponse.json({ requiresOtp: true, message: 'OTP sent to your email' });
    }

    const otpValid = await verifyOtp(normalizedEmail, String(otp));
    if (!otpValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    const token = await createToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      if (e.message.includes('OTP recently sent')) {
        return NextResponse.json({ error: e.message }, { status: 429 });
      }
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
