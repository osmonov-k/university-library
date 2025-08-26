// app/(whatever)/page.tsx
export const runtime = 'nodejs'; // keep this segment on Node

import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import { getDb } from '@/database/drizzle';
import { books, users } from '@/database/schema';
import { auth } from '@/auth';
import { desc } from 'drizzle-orm';

export default async function Home() {
  const session = await auth();

  const db = await getDb();

  const latestBoos = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <>
      <BookOverview {...latestBoos[0]} userId={session?.user?.id as string} />
      <BookList
        title="Latest Books"
        books={latestBoos.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
}
