import { api } from '@/shared/api/base';

import type { SignUp } from '../model/schema';

export async function register(data: SignUp) {
  await api.post('/auth/register/', data);
}
