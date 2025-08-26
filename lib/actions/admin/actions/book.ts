'use server';

import { getDb } from '@/database/drizzle';
import { books } from '@/database/schema';

export const createBook = async (params: BookParams) => {
  try {
    const db = await getDb();
    const newBook = await db
      .insert(books)
      .values({ ...params, availableCopies: params.totalCopies })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])), // <-- fix trailing semicolon/comma
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occured while creating the book',
    };
  }
};
