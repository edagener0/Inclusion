import z from 'zod';

export const ProfileSchema = z.object({
  id: z.int(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.url(),
  biography: z.string().nullable(),
});

export type Profile = z.infer<typeof ProfileSchema>;
