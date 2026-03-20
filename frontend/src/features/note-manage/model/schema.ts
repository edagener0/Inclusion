import { z } from 'zod';

import type { Note } from '@/entities/note';
import type { User } from '@/entities/user';

export const upsertNoteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty').max(100, 'Maximum 100 characters'),
});
export type UpsertNote = z.infer<typeof upsertNoteSchema>;

export function emptyNote(user: User): Note {
  return {
    user,
    content: 'What are you thinking?',
    id: 0,
    likesCount: 0,
    createdAt: new Date(),
    isLiked: false,
  };
}
