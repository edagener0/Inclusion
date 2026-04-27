import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { fetchMe, getProfileByUsername, searchProfiles } from './requests';

export const profileQueries = {
  all: ['profiles'] as const,
  byUsername: (username: string) =>
    queryOptions({
      queryKey: [...profileQueries.all, username] as const,
      queryFn: () => getProfileByUsername(username),
      enabled: !!username,
      staleTime: 5 * 60 * 1000,
    }),
  search: (query: string) =>
    infiniteQueryOptions({
      queryKey: [...profileQueries.all, 'search', query] as const,
      queryFn: (params) => searchProfiles(query, params.pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
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
