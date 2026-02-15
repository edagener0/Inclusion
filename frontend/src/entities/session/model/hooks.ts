import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchMe } from '../api/session';

export const sessionQueryOptions = queryOptions({
  queryKey: ['session', 'me'],
  queryFn: fetchMe,
  retry: false,
  staleTime: 60 * 1000,
});

export const useSession = () => useQuery(sessionQueryOptions);
