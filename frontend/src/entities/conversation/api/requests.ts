import { type PaginatedResponse, type PaginatedReturnData, api } from '@/shared/api';

import { type Conversation, ConversationSchema } from '../model/schema';

export async function fetchConversation(page: number): Promise<PaginatedReturnData<Conversation>> {
  const results = await api.get<PaginatedResponse<unknown>>('/dms', { params: { page } });
  return {
    data: ConversationSchema.array().parse(results.data.results),
    hasNextPage: results.data.next !== null,
  };
}
