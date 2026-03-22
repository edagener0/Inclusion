import { queryOptions } from '@tanstack/react-query';

import { fetchMe, getProfileByUsername } from './requests';

export const profileQueries = {
  all: ['profiles'] as const,
  byUsername: (username: string) =>
    queryOptions({
      queryKey: [...profileQueries.all, username] as const,
      queryFn: () => getProfileByUsername(username),
      enabled: !!username,
      staleTime: 5 * 60 * 1000,
    }),
};

export const userQueries = {
  all: ['users'] as const,
  me: () =>
    queryOptions({
      queryKey: [...userQueries.all, 'me'] as const,
      queryFn: fetchMe,
      staleTime: 6 * 60 * 1000,
    }),
};
