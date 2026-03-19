import { Heart } from 'lucide-react';

import type { Comment } from '@/entities/comment';
import { useLike } from '@/features/like-toggle';
import { Button } from '@/shared/ui/button';

type Props = {
  comment: Comment;
};

export function LikeButton({ comment }: Props) {
  const { isLiked, count, isPending, toggle } = useLike({
    initialCount: comment.likesCount,
    initialIsLiked: comment.isLiked,
    entityType: 'comments',
    entityId: comment.id,
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
