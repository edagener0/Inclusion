import { api } from '@/shared/api';

import { type AskChatBot, type ChatBotResponse, ChatBotResponseSchema } from '../model/schema';

export async function askBot(params: AskChatBot): Promise<ChatBotResponse> {
  const response = await api.post('/chatbot/message', params);
  return ChatBotResponseSchema.parse(response.data);
}
