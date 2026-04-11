import { api } from '@/shared/api';

import type { SendMessageDTO } from './types';

export async function sendMessage(dto: SendMessageDTO) {
  const { userId, ...body } = dto;
  await api.post(`/dms/${userId}/messages`, body);
}
