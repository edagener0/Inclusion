import type { QueryKey } from '@tanstack/react-query';

import { useToggleLikeMutation } from '../model/mutation';

type Args = {
  entityType: string;
  entityId: number;
  initialIsLiked: boolean;
  initialCount: number;
  queryKey: QueryKey;
};

export function useLike({ entityId, entityType, initialIsLiked, initialCount, queryKey }: Args) {
  const mutation = useToggleLikeMutation();

  const toggle = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (mutation.isPending) return;

    const newIsLiked = !initialIsLiked;
    const newCount = initialIsLiked ? initialCount - 1 : initialCount + 1;

    mutation.mutate({ entityType, entityId, isLiked: newIsLiked, count: newCount, queryKey });
  };

  return {
    isLiked: initialIsLiked,
    count: initialCount,
    toggle,
    isPending: mutation.isPending,
  };
}
