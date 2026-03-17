import z from 'zod';

export const PostSchema = z.object({
  id: z.int(),
  user: z.object({
    id: z.int(),
    username: z.string(),
    avatar: z.url(),
  }),
  file: z.url(),
  description: z.string().nullable(),
  likesCount: z.int(),
  isLiked: z.boolean(),
  createdAt: z.coerce.date(),
});
export type Post = z.infer<typeof PostSchema>;

export type CreatePostDTO = {
  description: string;
  file: File;
};
