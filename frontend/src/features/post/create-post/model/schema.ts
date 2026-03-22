import z from 'zod';

export const CreatePostSchema = z.object({
  description: z.string(),
  file: z.instanceof(File, { message: 'Media file is required.' }),
});
export type CreatePost = z.infer<typeof CreatePostSchema>;
