import { api } from '@/shared/api';

export async function sendRequest(userId: number): Promise<void> {
  await api.post('/friends/requests', { toUser: userId });
}

export async function acceptRequest(userId: number): Promise<void> {
  await api.post(`/friends/requests/accept/${userId}`);
}

export async function declineRequest(userId: number): Promise<void> {
  await api.delete(`/friends/requests/decline/${userId}`);
}

export async function cancelRequest(userId: number): Promise<void> {
  await api.delete(`/friends/requests/sent/${userId}`);
}

export async function removeFriend(userId: number): Promise<void> {
  await api.delete(`/friends/remove/${userId}`);
}
