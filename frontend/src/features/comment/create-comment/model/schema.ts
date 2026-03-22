import z from 'zod';

export const CreateCommentSchema = z.object({
  commentary: z.string().min(1, 'Comment cannot be empty').max(1000, 'Maximum 1000 characters'),
});
export type CreateComment = z.infer<typeof CreateCommentSchema>;
