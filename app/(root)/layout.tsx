export const runtime = 'nodejs';

import { auth } from '@/auth';
import Header from '@/components/Header';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import React, { ReactNode } from 'react';
import { getDb } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session) redirect('/sign-in');

  after(async () => {
    try {
      const id = Number(session.user?.id);
      if (!Number.isFinite(id)) return;

      const db = await getDb();

      // Pick the setter that matches your column type
      const userId = session.user?.id; // string | undefined
      if (!userId) return;

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (user[0].lastActivity === new Date().toISOString().slice(0, 10))
        return; // already updated today

      await db
        .update(users)
        .set({ lastActivity: new Date().toISOString().slice(0, 10) }) // or .slice(0,10) if string-mode date
        .where(eq(users.id, userId));
    } catch (e) {
      console.error('lastActivity update failed', e);
    }
  });

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
