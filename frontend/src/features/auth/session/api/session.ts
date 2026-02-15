import type { User } from '@/entities/user';
import { api } from '@/shared/api/base';

export async function fetchMe(): Promise<User> {
  const response = await api.get<User>('/auth/me', { withCredentials: true });
  return response.data;
}
