'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { borrowBook } from '@/lib/actions/book';

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrowBook = async () => {
    if (!isEligible) {
      toast('Error', { description: message });
    }

    setBorrowing(true);
    try {
      const result = await borrowBook({ bookId, userId });
      if (result.success) {
        toast('Success', { description: 'Book Borrowed successfully' });
        router.push('/my-profile');
      } else {
        toast('Error', {
          description: 'An error occured while borrowing the book',
        });
      }
    } catch (error) {
      toast('Error', {
        description: 'An error occured while borrowing the book',
      });
    } finally {
      setBorrowing(false);
    }
  };
  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrowBook}
      disabled={borrowing}
    >
      <Image
        src="/icons/book.svg"
        alt="book"
        width={22}
        height={22}
        className="w-[22px] h-[22px]"
      />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? 'Borrowing ...' : 'Borrow Book'}
      </p>
    </Button>
  );
};

export default BorrowBook;
