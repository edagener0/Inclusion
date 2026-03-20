import {
  type InfiniteData,
  type QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/shared/api/base';

interface Args {
  entityType: string;
  entityId: number;
  isLiked: boolean;
  count: number;
  queryKey: QueryKey;
}

type Entity = { id: number; isLiked: boolean; likesCount: number; [key: string]: unknown };
type InfinitePage = { data: Entity[]; [key: string]: unknown };

export function useToggleLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityType, entityId, isLiked }: Args) => {
      const method = isLiked ? 'post' : 'delete';
      const response = await api[method](`/${entityType}/${entityId}/like`);
      return response.data;
    },

    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: variables.queryKey });
      const previousData = queryClient.getQueryData(variables.queryKey);

      const updateLike = <T extends Entity>(item: T): T =>
        item.id === variables.entityId
          ? { ...item, isLiked: variables.isLiked, likesCount: variables.count }
          : item;

      /*
       * Since we mainly use infinite scrolling, it is not appropriate to make requests to update all
       * the pages that have already been scrolled because of one like, so we edit the cache directly
       * to provide an immediate optimistic update.
       */
      queryClient.setQueryData(variables.queryKey, (oldData: unknown) => {
        if (!oldData) return oldData;

        if (Array.isArray(oldData)) {
          return (oldData as Entity[]).map(updateLike);
        }

        if (typeof oldData === 'object' && 'pages' in oldData) {
          const infiniteData = oldData as InfiniteData<InfinitePage, unknown>;
          return {
            ...infiniteData,
            pages: infiniteData.pages.map(page => ({
              ...page,
              data: Array.isArray(page?.data) ? page.data.map(updateLike) : page.data,
            })),
          };
        }
        return oldData;
      });

      /*
       * Since the hook is reusable, we "assume" that the detail key is correct,
       * but if it doesn't exist, nothing will happen and there is no detail cache to update.
       */
      queryClient.setQueryData<Entity>(
        [variables.entityType, 'detail', variables.entityId],
        oldData => (oldData ? updateLike(oldData) : oldData),
      );

      return { previousData };
    },

    onError: (_, variables, context) => {
      if (context?.previousData && variables.queryKey) {
        queryClient.setQueryData(variables.queryKey, context.previousData);
      }
    },
  });
}
