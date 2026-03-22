import { api } from '@/shared/api';

import { type Session, SessionSchema, type SignInDTO, type SignUpDTO } from '../model/types';

export async function fetchMe(): Promise<Session> {
  const response = await api.get('/auth/me');
  return SessionSchema.parse(response.data);
}

export async function signOut() {
  await api.post('/auth/logout');
}

export async function signIn(dto: SignInDTO) {
  await api.post('/auth/login', dto);
}

export async function signUp(dto: SignUpDTO) {
  await api.post('/auth/register', dto);
}
