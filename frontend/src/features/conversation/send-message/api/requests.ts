import { api } from '@/shared/api';

import type { SendMessageDTO } from './types';

export async function sendMessage(userId: number, dto: SendMessageDTO) {
  await api.post(`/dms/${userId}/messages`, dto);
}
