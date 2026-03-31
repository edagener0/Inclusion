import z from 'zod';

export const CreateCommentSchema = z.object({
  commentary: z.string().min(1).max(1000),
});
export type CreateComment = z.infer<typeof CreateCommentSchema>;
