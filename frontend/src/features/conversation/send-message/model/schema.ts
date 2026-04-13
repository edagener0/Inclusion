import z from 'zod';

export const SendMessageSchema = z.object({
  content: z.string().min(1),
});
export type SendMessage = z.infer<typeof SendMessageSchema>;
