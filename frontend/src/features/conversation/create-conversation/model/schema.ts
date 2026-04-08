import { z } from 'zod';

export const CreateConversationSchema = z.object({
  userId: z.int().positive(),
  content: z.string().min(1),
});
export type CreateConversation = z.infer<typeof CreateConversationSchema>;
