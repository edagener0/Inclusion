import { api } from '@/shared/api';

export async function updateBio(bio: string) {
  await api.patch('/users/me', { biography: bio });
}
