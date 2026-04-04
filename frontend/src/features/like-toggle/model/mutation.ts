import {
  type InfiniteData,
  type QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/shared/api';

type BaseLikeable = { id: number; isLiked: boolean; likesCount: number };

type ToggleLikeArgs<TNode> = {
  entityType: string;
  entityId: number;
  isLiked: boolean;
  count: number;
  queryKey: QueryKey;
  updateNode?: (node: TNode, newIsLiked: boolean, newCount: number) => TNode;
};

export function useToggleLike<TNode extends object = BaseLikeable>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityType, entityId, isLiked }: ToggleLikeArgs<TNode>) => {
      const method = isLiked ? 'delete' : 'post';
      const response = await api[method](`/${entityType}/${entityId}/like`);
      return response.data;
    },

    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: variables.queryKey });
      const previousData = queryClient.getQueriesData({ queryKey: variables.queryKey });

      const newIsLiked = !variables.isLiked;
      const newCount = variables.isLiked ? Math.max(0, variables.count - 1) : variables.count + 1;

      const defaultUpdateNode = (item: TNode): TNode => {
        if ('id' in item && item.id === variables.entityId) {
          return { ...item, isLiked: newIsLiked, likesCount: newCount };
        }
        return item;
      };

      const updateLike = variables.updateNode
        ? (item: TNode) => variables.updateNode!(item, newIsLiked, newCount)
        : defaultUpdateNode;

      /*
       * Since we mainly use infinite scrolling, it is not appropriate to make requests to update all
       * the pages that have already been scrolled because of one like, so we edit the cache directly
       * to provide an immediate optimistic update.
       */
      queryClient.setQueriesData({ queryKey: variables.queryKey }, (oldData: unknown) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) return (oldData as TNode[]).map(updateLike);

        if (typeof oldData === 'object' && 'pages' in oldData) {
          const infiniteData = oldData as InfiniteData<
            { data: TNode[]; [key: string]: unknown },
            unknown
          >;
          return {
            ...infiniteData,
            pages: infiniteData.pages.map(page => ({
              ...page,
              data: Array.isArray(page?.data) ? page.data.map(updateLike) : page.data,
            })),
          };
        }

        if (typeof oldData === 'object' && !Array.isArray(oldData) && !('pages' in oldData)) {
          return updateLike(oldData as TNode);
        }

        return oldData;
      });

      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}
