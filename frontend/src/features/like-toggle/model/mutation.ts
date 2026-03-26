import {
  type InfiniteData,
  type QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/shared/api';

// Базовый тип сущности
export type BaseLikeable = { id: number; isLiked: boolean; likesCount: number };

export type ToggleLikeArgs<TNode> = {
  entityType: string;
  entityId: number;
  isLiked: boolean; // Текущее состояние ДО клика
  count: number; // Текущее количество ДО клика
  queryKey: QueryKey;
  // Функция знает новые значения и просит вернуть обновленный узел
  updateNode?: (node: TNode, newIsLiked: boolean, newCount: number) => TNode;
};

export function useToggleLike<TNode extends object = BaseLikeable>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityType, entityId, isLiked }: ToggleLikeArgs<TNode>) => {
      // Если было лайкнуто, значит сейчас мы лайк УБИРАЕМ (delete), и наоборот
      const method = isLiked ? 'delete' : 'post';
      const response = await api[method](`/${entityType}/${entityId}/like`);
      return response.data;
    },

    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: variables.queryKey });
      const previousData = queryClient.getQueryData(variables.queryKey);

      // Вычисляем новые значения прямо здесь
      const newIsLiked = !variables.isLiked;
      const newCount = variables.isLiked ? Math.max(0, variables.count - 1) : variables.count + 1;

      // Дефолтная логика без any
      const defaultUpdateNode = (item: TNode): TNode => {
        if ('id' in item && item.id === variables.entityId) {
          return { ...item, isLiked: newIsLiked, likesCount: newCount };
        }
        return item;
      };

      const updateLike = variables.updateNode
        ? (item: TNode) => variables.updateNode!(item, newIsLiked, newCount)
        : defaultUpdateNode;

      // Логика обновления кэша (остается твоя, она отличная)
      queryClient.setQueryData(variables.queryKey, (oldData: unknown) => {
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
        return oldData;
      });

      queryClient.setQueryData(
        [variables.entityType, 'detail', variables.entityId],
        (oldData: unknown) => (oldData ? updateLike(oldData as TNode) : oldData),
      );

      return { previousData };
    },

    onError: (_, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(variables.queryKey, context.previousData);
      }
    },
  });
}
