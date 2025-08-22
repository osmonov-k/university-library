import { eq } from 'drizzle-orm';
import NextAuth, { type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { users } from './database/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { getDb } = await import('./database/drizzle'); // ← dynamic
        const db = await getDb();

        const rows = await db
          .select()
          .from(users)
          .where(eq(users.email, String(credentials.email)))
          .limit(1);

        if (rows.length === 0) return null;

        const { compare } = await import('bcryptjs'); // ← dynamic
        const ok = await compare(
          String(credentials.password),
          rows[0].password,
        );
        if (!ok) return null;

        return {
          id: String(rows[0].id),
          email: rows[0].email,
          name: rows[0].fullName,
        } as User;
      },
    }),
  ],
  pages: { signIn: '/sign-in' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
