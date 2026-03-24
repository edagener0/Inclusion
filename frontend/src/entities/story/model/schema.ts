import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const StorySchema = z.object({
  id: z.int(),
  user: UserPreviewSchema,
  file: z.httpUrl(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Story = z.infer<typeof StorySchema>;
