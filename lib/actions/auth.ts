// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
import { users } from '@/database/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { getDb } = await import('@/database/drizzle'); // dynamic
        const { compare } = await import('bcryptjs'); // dynamic
        const db = await getDb();

        const rows = await db
          .select()
          .from(users)
          .where(eq(users.email, String(credentials.email)))
          .limit(1);
        if (rows.length === 0) return null;

        const ok = await compare(
          String(credentials.password),
          rows[0].password,
        );
        if (!ok) return null;

        return {
          id: String(rows[0].id),
          email: rows[0].email,
          name: rows[0].fullName,
        };
      },
    }),
  ],
});
