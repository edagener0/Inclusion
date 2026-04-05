import { LikeButton } from '@/features/like-toggle';
import { useToggleLike } from '@/features/like-toggle';

import { type Note, noteQueries } from '@/entities/note';

type Props = {
  noteId: number;
  isLiked: boolean;
  likesCount: number;
};

export function NoteLikeButton({ noteId, isLiked, likesCount }: Props) {
  const { mutate, isPending } = useToggleLike<Note>();

  const handleToggle = () => {
    mutate({
      entityType: noteQueries.entityType,
      entityId: noteId,
      isLiked,
      count: likesCount,
      queryKey: noteQueries.list().queryKey,
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
