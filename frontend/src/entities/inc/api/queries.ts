import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { fetchIncs, fetchIncsByUsername, getInc } from './requests';

export const incQueries = {
  entityType: 'incs',
  all: () => [incQueries['entityType']] as const,
  feed: () =>
    infiniteQueryOptions({
      queryKey: [...incQueries.all(), 'feed'] as const,
      queryFn: ({ pageParam }) => fetchIncs(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
  byUsername: (username: string) =>
    infiniteQueryOptions({
      queryKey: [...incQueries.all(), 'username', username] as const,
      queryFn: ({ pageParam }) => fetchIncsByUsername(pageParam, username),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...incQueries.all(), 'detail', id] as const,
      queryFn: () => getInc(id),
      staleTime: 5 * 60 * 1000,
    }),
};
