import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const IncSchema = z.object({
  id: z.int(),
  user: UserPreviewSchema,
  content: z.string(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Inc = z.infer<typeof IncSchema>;
