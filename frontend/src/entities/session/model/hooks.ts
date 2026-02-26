import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchMe } from '../api/session';

export const sessionQueryKey = ['session', 'me'];

export const sessionQueryOptions = queryOptions({
  queryKey: sessionQueryKey,
  queryFn: fetchMe,
  retry: false,
  staleTime: 60 * 1000,
});

export const useSession = () => useQuery(sessionQueryOptions);

export const useStrictSession = () => {
  const query = useSession();

  if (!query.data) {
    throw new Error('useStrictSession must be used within an authorized route');
  }

  return query.data;
};
