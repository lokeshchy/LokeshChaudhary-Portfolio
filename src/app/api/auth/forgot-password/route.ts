import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/lib/password-reset';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email : '';

    await requestPasswordReset(email);
    // Generic response avoids account/email enumeration.
    return NextResponse.json({
      message: 'If the account is eligible, a reset link has been sent.',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'If the account is eligible, a reset link has been sent.' },
      { status: 200 }
    );
  }
}
