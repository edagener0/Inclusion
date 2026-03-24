import z from 'zod';

import { UserPreviewSchema } from '@/shared/api';

export const ProfileSchema = UserPreviewSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  biography: z.string().nullable(),
  friendsCount: z.int(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const UserSchema = UserPreviewSchema.extend({
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  biography: z.string().nullable(),
  isPrivate: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;
