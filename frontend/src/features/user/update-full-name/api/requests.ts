import { api } from '@/shared/api/base';

import type { UpdateFullName } from '../model/schema';

export async function updateFullName(data: UpdateFullName) {
  await api.patch('/users/me', data);
}
