import { queryOptions } from '@tanstack/react-query';

import { fetchMe } from './requests';

export const sessionQueries = {
  all: () => ['session'] as const,
  me: () =>
    queryOptions({
      queryKey: [...sessionQueries.all(), 'me'],
      queryFn: fetchMe,
      retry: false,
      staleTime: 60 * 1000,
      networkMode: 'always',
    }),
};
