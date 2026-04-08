import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import { type Friend, friendQueries } from '@/entities/friend';

export function useSetFriendStatus() {
  const queryClient = useQueryClient();

  const setFriendStatus = (targetUserId: number, isFriendStatus: boolean) => {
    const queryFilter = { queryKey: [...friendQueries.all(), 'username'] as const };

    queryClient.setQueriesData(queryFilter, (oldData: unknown) => {
      if (!oldData) return oldData;

      if (typeof oldData === 'object' && 'pages' in oldData) {
        const infiniteData = oldData as InfiniteData<
          { data: Friend[]; [key: string]: unknown },
          unknown
        >;

        return {
          ...infiniteData,
          pages: infiniteData.pages.map((page) => ({
            ...page,
            data: Array.isArray(page?.data)
              ? page.data.map((user) =>
                  user.id === targetUserId ? { ...user, isFriend: isFriendStatus } : user,
                )
              : page.data,
          })),
        };
      }

      return oldData;
    });
  };

  return { setFriendStatus };
}
