import { api } from '@/shared/api';

import { type Profile, profileSchema } from '../model/types';

export async function getProfileByUsername(username: string): Promise<Profile> {
  const response = await api.get(`/profiles/${username}`);
  return profileSchema.parse(response.data);
}
