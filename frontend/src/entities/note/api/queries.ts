import { queryOptions } from '@tanstack/react-query';

import { getNotes } from './requests';

export const noteQueries = {
  entityType: 'notes',
  all: () => [noteQueries['entityType']] as const,
  list: () =>
    queryOptions({
      queryKey: [...noteQueries.all(), 'list'],
      queryFn: getNotes,
      staleTime: 5 * 60 * 1000,
    }),
};
