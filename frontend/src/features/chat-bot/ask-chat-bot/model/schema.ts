import z from 'zod';

export const ChatBotResponseSchema = z.object({
  response: z.string(),
});
export type ChatBotResponse = z.infer<typeof ChatBotResponseSchema>;

export const AskChatBotSchema = z.object({
  prompt: z.string().min(1),
});
export type AskChatBot = z.infer<typeof AskChatBotSchema>;
