export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { ratelimit } from '@/lib/ratelimit';
import { getClientIp, signInKey } from '@/lib/request-ids';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email and password are required' },
      { status: 400 },
    );
  }

  const ip = await getClientIp(); // <-- await here
  const keys = signInKey(ip, email);

  const [byIp, byId] = await Promise.all([
    ratelimit.limit(keys.ipKey),
    ratelimit.limit(keys.idKey),
  ]);

  if (!byIp.success || !byId.success) {
    const reset = Math.max(byIp.reset, byId.reset);
    return NextResponse.json(
      {
        success: false,
        error: 'Too many sign-in attempts. Try again shortly.',
        resetAt: reset,
      },
      { status: 429 },
    );
  }

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if ((result as any)?.error) {
      return NextResponse.json(
        { success: false, error: (result as any).error },
        { status: 401 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message ?? 'Failed to sign in' },
      { status: 500 },
    );
  }
}
