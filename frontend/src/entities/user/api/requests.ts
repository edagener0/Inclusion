import { api } from '@/shared/api';

import { type Profile, ProfileSchema, type User, UserSchema } from '../model/schema';

export async function getProfileByUsername(username: string): Promise<Profile> {
  const response = await api.get(`/profiles/${username}`);
  return ProfileSchema.parse(response.data);
}

export async function fetchMe(): Promise<User> {
  const response = await api.get('/users/me');
  return UserSchema.parse(response.data);
}
