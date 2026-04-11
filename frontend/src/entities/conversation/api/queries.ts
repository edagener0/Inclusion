import { infiniteQueryOptions } from '@tanstack/react-query';

import { fetchConversation, fetchMessages } from './requests';

export const conversationbQueries = {
  entityType: 'dms',
  all: () => [conversationbQueries['entityType']] as const,
  feed: () =>
    infiniteQueryOptions({
      queryKey: [...conversationbQueries.all(), 'feed'] as const,
      queryFn: ({ pageParam }) => fetchConversation(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
  messages: (userId: number) =>
    infiniteQueryOptions({
      queryKey: [...conversationbQueries.all(), 'messages', userId] as const,
      queryFn: ({ pageParam }) => fetchMessages(userId, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
};
