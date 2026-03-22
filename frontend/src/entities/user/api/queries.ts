import { queryOptions } from '@tanstack/react-query';

import { getProfileByUsername } from './requests';

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
