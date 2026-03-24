import { z } from 'zod';

import type { Note } from '@/entities/note';
import type { UserPreview } from '@/shared/api';

export const UpsertNoteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty').max(100, 'Maximum 100 characters'),
});
export type UpsertNote = z.infer<typeof UpsertNoteSchema>;

export function emptyNote(user: UserPreview): Note {
  return {
    user,
    content: 'What are you thinking?',
    id: 0,
    likesCount: 0,
    createdAt: new Date(),
    isLiked: false,
  };
}
