import { api } from '@/shared/api';

export async function deleteMessage(id: number) {
  await api.delete(`/dms/messages/${id}`);
}
