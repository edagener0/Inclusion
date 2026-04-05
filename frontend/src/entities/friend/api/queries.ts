import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { fetchFriendsByUsername, fetchReceived, getReceivedById, getSentById } from './requests';

export const friendQueries = {
  entityType: 'friends',
  all: () => [friendQueries['entityType']] as const,
  friendsByUsername: (username: string) =>
    infiniteQueryOptions({
      queryKey: [...friendQueries.all(), 'username', username] as const,
      queryFn: ({ pageParam }) => fetchFriendsByUsername(pageParam, username),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
  requests: {
    key: 'requests' as const,
    received: {
      key: 'received' as const,
      received: () =>
        infiniteQueryOptions({
          queryKey: [
            ...friendQueries.all(),
            friendQueries.requests.key,
            friendQueries.requests.received.key,
          ] as const,
          queryFn: ({ pageParam }) => fetchReceived(pageParam),
          initialPageParam: 1,
          getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.hasNextPage) return undefined;

            return allPages.length + 1;
          },
          staleTime: 60 * 1000,
        }),
      receivedById: (userId: number) =>
        queryOptions({
          queryKey: [
            ...friendQueries.all(),
            friendQueries.requests.key,
            friendQueries.requests.received.key,
            userId,
          ] as const,
          queryFn: () => getReceivedById(userId),
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
