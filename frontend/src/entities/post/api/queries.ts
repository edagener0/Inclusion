import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { fetchPostById, fetchPosts, fetchPostsByUsername } from './requests';

export const postQueries = {
  entityType: 'posts',
  all: () => ['posts'] as const,
  feed: () =>
    infiniteQueryOptions({
      queryKey: [...postQueries.all(), 'feed'] as const,
      queryFn: ({ pageParam }) => fetchPosts(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
  byUsername: (username: string) =>
    infiniteQueryOptions({
      queryKey: [...postQueries.all(), 'username', username] as const,
      queryFn: ({ pageParam }) => fetchPostsByUsername(pageParam, username),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...postQueries.all(), 'detail', id] as const,
      queryFn: () => fetchPostById(id),
      staleTime: 5 * 60 * 1000,
    }),
};
