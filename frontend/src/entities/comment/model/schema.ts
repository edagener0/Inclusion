import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const CommentSchema = z.object({
  id: z.int(),
  user: UserPreviewSchema,
  commentary: z.string(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Comment = z.infer<typeof CommentSchema>;
