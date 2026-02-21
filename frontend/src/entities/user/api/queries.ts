import { useQuery } from '@tanstack/react-query';

import { userQueryKeys } from './query-keys';
import { fetchUserByUsername } from './requests';

export const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryKey: userQueryKeys.detailByUsername(username),
    queryFn: () => fetchUserByUsername(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};
