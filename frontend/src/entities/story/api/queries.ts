import { infiniteQueryOptions } from '@tanstack/react-query';

import { fetchStories } from './requests';

export const storyQueries = {
  entityType: 'stories',
  all: () => [storyQueries['entityType']] as const,
  feed: () =>
    infiniteQueryOptions({
      queryKey: [...storyQueries.all(), 'feed'] as const,
      queryFn: ({ pageParam }) => fetchStories(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
};
