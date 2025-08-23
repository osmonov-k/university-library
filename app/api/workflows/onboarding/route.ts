import { serve } from '@upstash/workflow/nextjs';

import { getDb } from '@/database/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/database/schema';
import { sendEmail } from '@/lib/workflow';
type UserState = 'non-active' | 'active';
type InitialData = { email: string; fullName: string };

const DAY = 24 * 60 * 60 * 1000;
const THREE_DAYS = 3 * DAY;
const THIRTY_DAYS = 30 * DAY;

const getUserState = async (email: string): Promise<UserState> => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (rows.length === 0) return 'non-active';

  const lastRaw = rows[0].lastActivity;
  if (!lastRaw) return 'non-active';

  const diffMs = Date.now() - new Date(lastRaw).getTime();
  // tweak this logic as you like
  if (diffMs > THREE_DAYS /* && diffMs <= THIRTY_DAYS */) return 'non-active';
  return 'active';
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run('new-signup', () =>
    sendEmail({
      email,
      subject: 'Welcome to the platform',
      message: `Welcome ${fullName}`,
    }),
  );

  await context.sleep('wait-for-3-days', 60 * 60 * 24 * 3); // seconds

  while (true) {
    const state = await context.run('check-user-state', () =>
      getUserState(email),
    );

    if (state === 'non-active') {
      await context.run('send-email-non-active', () =>
        sendEmail({
          email,
          subject: 'Are you still there?',
          message: `Hey ${fullName}, we noticed you haven't been active lately. We miss you!`,
        }),
      );
    } else {
      await context.run('send-email-active', () =>
        sendEmail({
          email,
          subject: 'Thank you for being with us!',
          message: `Hey ${fullName}, thank you for being an active member of our community!`,
        }),
      );
      break;
    }

    await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30); // seconds
  }
});
