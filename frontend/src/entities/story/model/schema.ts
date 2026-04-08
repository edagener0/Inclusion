import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const StorySchema = z.object({
  id: z.int(),
  user: UserPreviewSchema,
  file: z.url(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Story = z.infer<typeof StorySchema>;

export const UserStoriesSchema = z.object({
  user: UserPreviewSchema,
  stories: StorySchema.omit({ user: true }).array(),
});
export type UserStories = z.infer<typeof UserStoriesSchema>;
