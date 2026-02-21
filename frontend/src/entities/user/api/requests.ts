import { api } from '@/shared/api/base';

import type { User } from '../model/types';

export const fetchUserByUsername = async (username: string): Promise<User> => {
  const response = await api.get<User>(`/users/${username}/`);
  return response.data;
};
