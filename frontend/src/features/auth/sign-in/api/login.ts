import { api } from '@/shared/api/base';

import type { SignIn } from '../model/schema';

export async function login(data: SignIn) {
  await api.post('/auth/login/', data, { withCredentials: true });
}
