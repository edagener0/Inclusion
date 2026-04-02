import { api } from '@/shared/api';

export async function sendRequest(userId: number): Promise<void> {
  await api.post('/friends/requests', { toUser: userId });
}
