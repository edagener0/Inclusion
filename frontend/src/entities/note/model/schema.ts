import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const NoteSchema = z.object({
  id: z.int(),
  user: UserPreviewSchema,
  content: z.string(),
  isLiked: z.boolean(),
  likesCount: z.int(),
  createdAt: z.coerce.date(),
});
export type Note = z.infer<typeof NoteSchema>;
