import z from 'zod';

export const ProfileSchema = z.object({
  id: z.int(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.url(),
  biography: z.string().nullable(),
  friendsCount: z.int(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const UserSchema = z.object({
  id: z.int(),
  username: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  biography: z.string().nullable(),
  avatar: z.url(),
  isPrivate: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;
