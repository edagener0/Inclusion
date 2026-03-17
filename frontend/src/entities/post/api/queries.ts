import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { fetchPostById, fetchPosts } from './requests';

const LIMIT = 10;
export const postQueries = {
  all: () => ['posts'] as const,
  feed: () =>
    infiniteQueryOptions({
      queryKey: [...postQueries.all(), 'feed'] as const,
      queryFn: ({ pageParam }) => fetchPosts(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < LIMIT) return undefined;

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
