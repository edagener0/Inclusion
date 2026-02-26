import { useQuery } from '@tanstack/react-query';

import { profileQueryKeys } from './query-keys';
import { fetchProfileByUsername } from './requests';

export const useGetProfileByUsername = (username: string) => {
  return useQuery({
    queryKey: profileQueryKeys.byUsername(username),
    queryFn: () => fetchProfileByUsername(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
};
