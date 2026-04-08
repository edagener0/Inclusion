import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const FriendSchema = UserPreviewSchema.extend({
  isFriend: z.boolean(),
});
export type Friend = z.infer<typeof FriendSchema>;
