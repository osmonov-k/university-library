import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string(),
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty('University card is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const signInSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});
