import { useEffect, useState } from 'react';

import { useToggleLikeMutation } from '../api/queries';

type Args = {
  endpoint: string;
  initialIsLiked: boolean;
  initialCount: number;
};

export function useLike({ endpoint, initialIsLiked, initialCount }: Args) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialCount);
  const mutation = useToggleLikeMutation();

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setCount(initialCount);
  }, [initialIsLiked, initialCount]);

  const toggle = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (mutation.isPending) return;

    setIsLiked(!isLiked);
    setCount(isLiked ? count - 1 : count + 1);

    mutation.mutate(
      { endpoint, isLiked },
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
