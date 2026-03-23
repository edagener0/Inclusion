import z from 'zod';

export const IncSchema = z.object({
  id: z.int(),
  user: z.object({
    id: z.int(),
    username: z.string(),
    avatar: z.url(),
  }),
  content: z.string().min(1, 'Inc can not be empty.').max(1000, 'Maximum 1000 characters.'),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Inc = z.infer<typeof IncSchema>;
