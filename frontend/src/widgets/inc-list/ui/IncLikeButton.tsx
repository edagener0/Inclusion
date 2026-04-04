import { type Inc, incQueries } from '@/entities/inc';
import { LikeButton } from '@/features/like-toggle';
import { useToggleLike } from '@/features/like-toggle';

type Props = {
  incId: number;
  isLiked: boolean;
  likesCount: number;
};

export function IncLikeButton({ incId, isLiked, likesCount }: Props) {
  const { mutate, isPending } = useToggleLike<Inc>();

  const handleToggle = () => {
    mutate({
      entityType: incQueries.entityType,
      entityId: incId,
      isLiked,
      count: likesCount,
      queryKey: incQueries.all(),
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
