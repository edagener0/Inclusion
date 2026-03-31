import { z } from 'zod';

import type { Note } from '@/entities/note';
import type { UserPreview } from '@/shared/api';

export const UpsertNoteSchema = z.object({
  content: z.string().min(1).max(100),
});
export type UpsertNote = z.infer<typeof UpsertNoteSchema>;

export function emptyNote(user: UserPreview) {
  return {
    user,
    content: 'create.default',
    id: 0,
    likesCount: 0,
    createdAt: new Date(),
    isLiked: false,
  } as const satisfies Note;
}
