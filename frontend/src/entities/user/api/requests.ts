import { api } from '@/shared/api';

import { type Profile, type User, profileSchema, userSchema } from '../model/types';

export async function getProfileByUsername(username: string): Promise<Profile> {
  const response = await api.get(`/profiles/${username}`);
  return profileSchema.parse(response.data);
}

export async function fetchMe(): Promise<User> {
  const response = await api.get('/users/me');
  return userSchema.parse(response.data);
}
