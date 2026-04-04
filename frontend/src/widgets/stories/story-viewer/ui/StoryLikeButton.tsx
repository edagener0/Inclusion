import { LikeButton } from '@/features/like-toggle';
import { useToggleLike } from '@/features/like-toggle';

import { type UserStories, storyQueries, updateStoryLikeInCache } from '@/entities/story';

type Props = {
  storyId: number;
  isLiked: boolean;
  likesCount: number;
};

export function StoryLikeButton({ storyId, isLiked, likesCount }: Props) {
  const { mutate, isPending } = useToggleLike<UserStories>();

  const handleToggle = () => {
    mutate({
      entityType: 'stories',
      entityId: storyId,
      isLiked,
      count: likesCount,
      queryKey: storyQueries.feed().queryKey,
      updateNode: (node, newIsLiked, newCount) =>
        updateStoryLikeInCache(node, storyId, newIsLiked, newCount),
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
