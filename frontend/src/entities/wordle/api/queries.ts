import { queryOptions } from '@tanstack/react-query';

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
    queryOptions({
      queryKey: [...wordleQueries.all(), 'leaderboar'],
      queryFn: getWordleLeaderboard,
      staleTime: 1 * 60 * 1000,
    }),
};
