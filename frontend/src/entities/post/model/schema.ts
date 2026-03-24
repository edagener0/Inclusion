import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const PostSchema = z.object({
  id: z.int(),
  user: UserPreviewSchema,
  file: z.url(),
  description: z.string().nullable(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Post = z.infer<typeof PostSchema>;
