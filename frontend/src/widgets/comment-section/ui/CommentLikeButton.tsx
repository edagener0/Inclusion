import { commentQueries } from '@/entities/comment';
import { LikeButton, useToggleLike } from '@/features/like-toggle';

type Props = {
  entityType: string;
  entityId: number;
  commentId: number;
  isLiked: boolean;
  likesCount: number;
};

export function CommentLikeButton({ entityType, entityId, commentId, isLiked, likesCount }: Props) {
  const { mutate, isPending } = useToggleLike<Comment>();

  const handleToggle = () => {
    mutate({
      entityType: commentQueries.entityType,
      entityId: commentId,
      isLiked,
      count: likesCount,
      queryKey: commentQueries.feed(entityType, entityId).queryKey,
    });
  };

  return (
    <LikeButton
      count={likesCount}
      isLiked={isLiked}
      isLoading={isPending}
      onToggle={handleToggle}
    />
  );
}
