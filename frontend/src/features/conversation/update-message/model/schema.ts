import z from 'zod';

export const UpdateMessageSchema = z.object({
  content: z.string().min(1),
});
export type UpdateMessage = z.infer<typeof UpdateMessageSchema>;
