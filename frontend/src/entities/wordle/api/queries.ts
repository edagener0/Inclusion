import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { getWordleLeaderboard, getWordleWord } from './requests';

export const wordleQueries = {
  entityType: 'wordle',
  all: () => [wordleQueries.entityType] as const,
  word: () =>
    queryOptions({
      queryKey: [...wordleQueries.all(), 'word'],
      queryFn: getWordleWord,
      staleTime: 5 * 60 * 1000,
    }),

  leaderboard: () =>
    infiniteQueryOptions({
      queryKey: [...wordleQueries.all(), 'leaderboard'] as const,
      queryFn: ({ pageParam }) => getWordleLeaderboard(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNextPage) return undefined;

        return allPages.length + 1;
      },
      staleTime: 60 * 1000,
    }),
};
