import { api } from '@/shared/api/base';

import type { Profile } from '../model/types';

export const fetchProfileByUsername = async (username: string): Promise<Profile> => {
  const response = await api.get<Profile>(`/profiles/${username}`);
  return response.data;
};
