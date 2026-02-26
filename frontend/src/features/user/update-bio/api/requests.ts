import { api } from '@/shared/api/base';

export async function updateBio(bio: string) {
  await api.patch('/users/me', { biography: bio });
}
