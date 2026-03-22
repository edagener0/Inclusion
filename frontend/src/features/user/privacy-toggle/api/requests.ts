import { api } from '@/shared/api';

export async function updateAccountPrivacy(isPrivate: boolean) {
  await api.patch('/users/me', { isPrivate });
}
