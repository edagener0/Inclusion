import { infiniteQueryOptions } from '@tanstack/react-query';

import { fetchComments } from './requests';

export const commentQueries = {
  all: (entityType: string) => ['comments', entityType] as const,
  feed: (entityType: string, entityId: number) =>
    infiniteQueryOptions({
      queryKey: [...commentQueries.all(entityType), 'feed', entityId] as const,
      queryFn: ({ pageParam: page }) => fetchComments({ entityType, entityId, page }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;
        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
};
