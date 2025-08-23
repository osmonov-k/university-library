export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDb } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { workflowClient } from '@/lib/workflow';
import { clientEnv } from '@/lib/config.client';

export async function POST(req: Request) {
  const { fullName, email, password, universityId, universityCard } =
    await req.json();

  if (!email || !password || !fullName) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 },
    );
  }

  const db = await getDb();

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json(
      { success: false, error: 'User with this email already exists' },
      { status: 409 },
    );
  }

  const hashedPassword = await hash(password, 10);

  await db.insert(users).values({
    fullName,
    email,
    password: hashedPassword,
    universityId,
    universityCard,
  });

  await workflowClient.trigger({
    url: `${clientEnv.prodApiEndpoint}/api/workflows/onboarding`,
    body: { email, fullName },
  });

  return NextResponse.json({ success: true });
}
