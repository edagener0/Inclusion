import { useState } from 'react';

import { useToggleLikeMutation } from '../api/queries';

type Args = {
  entityType: string;
  entityId: number;
  initialIsLiked: boolean;
  initialCount: number;
};

export function useLike({ entityId, entityType, initialIsLiked, initialCount }: Args) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialCount);
  const mutation = useToggleLikeMutation();

  const toggle = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (mutation.isPending) return;

    setIsLiked(!isLiked);
    setCount(isLiked ? count - 1 : count + 1);

    mutation.mutate(
      { entityType, entityId, isLiked },
      {
        onError: () => {
          setIsLiked(isLiked);
          setCount(count);
        },
      },
    );
  };

  return { isLiked, count, toggle, isPending: mutation.isPending };
}
