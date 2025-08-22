// app/(whatever)/page.tsx
export const runtime = 'nodejs'; // keep this segment on Node

import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import { sampleBooks } from '../constants';
import { getDb } from '@/database/drizzle';
import { users } from '@/database/schema';

export default async function Home() {
  const db = await getDb();
  const result = await db.select().from(users); // <-- safe
  // console.log(result) if you want to verify

  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
}
