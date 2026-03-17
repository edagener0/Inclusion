import z from 'zod';

export const PostSchema = z.object({
  id: z.int(),
  user: z.object({
    id: z.int(),
    username: z.string(),
    avatar: z.url(),
  }),
  file: z.file(),
  description: z.string(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.date(),
});
export type Post = z.infer<typeof PostSchema>;
