import type { QueryKey } from '@tanstack/react-query';
import { Heart } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import { useLike } from '../lib/use-like';

type Props = {
  likesCount: number;
  isLiked: boolean;
  entityType: string;
  entityId: number;
  queryKey: QueryKey;
};

export function LikeButton({
  entityId,
  entityType,
  likesCount: initialCount,
  isLiked: initialIsLiked,
  queryKey,
}: Props) {
  const { isLiked, count, isPending, toggle } = useLike({
    entityId,
    entityType,
    initialCount,
    initialIsLiked,
    queryKey,
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={isPending}
      className={`gap-2 transition-colors ${
        isLiked
          ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
          : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
      }`}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      {count}
    </Button>
  );
}
