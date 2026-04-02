import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { fetchRequests, getRequestById, getSentById } from './requests';

export const friendQueries = {
  entityType: 'friends',
  all: () => [friendQueries['entityType']] as const,
  requests: {
    key: 'requests' as const,
    received: {
      key: 'received' as const,
      requests: () =>
        infiniteQueryOptions({
          queryKey: [
            ...friendQueries.all(),
            friendQueries.requests.key,
            friendQueries.requests.received.key,
          ] as const,
          queryFn: ({ pageParam }) => fetchRequests(pageParam),
          initialPageParam: 1,
          getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.hasNextPage) return undefined;

            return allPages.length + 1;
          },
          staleTime: 60 * 1000,
        }),
      requestById: (userId: number) =>
        queryOptions({
          queryKey: [
            ...friendQueries.all(),
            friendQueries.requests.key,
            friendQueries.requests.received.key,
            userId,
          ] as const,
          queryFn: () => getRequestById(userId),
          staleTime: 5 * 60 * 1000,
        }),
    },
    sentById: (userId: number) =>
      queryOptions({
        queryKey: [...friendQueries.all(), friendQueries.requests.key, 'sent', userId] as const,
        queryFn: () => getSentById(userId),
        staleTime: 5 * 60 * 1000,
      }),
  },
};
