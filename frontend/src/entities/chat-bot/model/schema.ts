import z from 'zod';

export const ChatBotMessageSchema = z.object({
  id: z.int(),
  isBot: z.boolean(),
  message: z.string(),
  createdAt: z.coerce.date(),
});
export type ChatBotMessage = z.infer<typeof ChatBotMessageSchema>;
