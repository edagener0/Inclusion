import { api } from '@/shared/api';

export async function updateAvatar(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);

  await api.patch('/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
