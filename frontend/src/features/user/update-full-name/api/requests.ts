import { api } from '@/shared/api';

import type { UpdateFullName } from '../model/schema';

export async function updateFullName(data: UpdateFullName) {
  await api.patch('/users/me', data);
}
