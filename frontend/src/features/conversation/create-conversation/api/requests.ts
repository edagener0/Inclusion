import { api } from '@/shared/api';

import type { CreateConversationDTO } from './types';

export async function createConversation(dto: CreateConversationDTO) {
  await api.post('/dms', {
    receiver: dto.userId,
    content: dto.content,
  });
}
