import { api } from '@/shared/api';

import type { UpdateMessageDTO } from './types';

export async function updateMessage(messageId: number, dto: UpdateMessageDTO) {
  await api.patch(`/dms/messages/${messageId}`, dto);
}
