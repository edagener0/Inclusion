import { LikeButton } from '@/features/like-toggle';
import { useToggleLike } from '@/features/like-toggle';

import { type Post, postQueries } from '@/entities/post';

type Props = {
  postId: number;
  isLiked: boolean;
  likesCount: number;
};

export function PostLikeButton({ postId, isLiked, likesCount }: Props) {
  const { mutate, isPending } = useToggleLike<Post>();

  const handleToggle = () => {
    mutate({
      entityType: postQueries.entityType,
      entityId: postId,
      isLiked,
      count: likesCount,
      queryKey: postQueries.all(),
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
