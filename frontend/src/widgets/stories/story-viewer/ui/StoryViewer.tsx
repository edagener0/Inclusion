import { useInfiniteQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { StoryHeader, StoryMedia, StoryProgress, storyQueries } from '@/entities/story';
import { UserAvatar } from '@/entities/user';
import { Button } from '@/shared/ui/button';

import { useStoryViewer } from '../model/user-story-viewer';
import { StoryActions } from './StoryActions';
import { StoryLikeButton } from './StoryLikeButton';

type Props = {
  initialId: number;
  onClose?: () => void;
};

export function StoryViewer({ initialId, onClose }: Props) {
  const { data } = useInfiniteQuery(storyQueries.feed());
  const flatData = data?.pages.flatMap(p => p.data) ?? [];

  const { currentStory, currentUserGroup, currentIndex, next, prev } = useStoryViewer(
    flatData,
    initialId,
    onClose,
  );

  if (!currentUserGroup || !currentStory) return null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black select-none">
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col gap-3 p-4 bg-linear-to-b from-black/60 to-transparent pointer-events-none">
        <StoryProgress total={currentUserGroup.stories.length} currentIndex={currentIndex} />

        <div className="flex items-center justify-between w-full">
          <div className="pointer-events-auto">
            <StoryHeader
              user={currentUserGroup.user}
              createdAt={currentStory.createdAt}
              userAvatarSlot={
                <UserAvatar
                  avatar={currentUserGroup.user.avatar}
                  username={currentUserGroup.user.username}
                />
              }
            />
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <StoryActions storyId={currentStory.id} />

            {onClose && (
              <Button
                variant="ghost"
                onClick={onClose}
                className="p-2 text-white/80 transition-colors hover:text-white hover:bg-white/20 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
                aria-label="Close story"
              >
                <X className="w-6 h-6 drop-shadow-md" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <StoryMedia story={currentStory} />
      </div>

      <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={prev} />

      <div className="absolute inset-y-0 right-0 w-2/3 z-10 cursor-pointer" onClick={next} />

      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-end p-4 bg-linear-to-t from-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <StoryLikeButton
            storyId={currentStory.id}
            isLiked={currentStory.isLiked}
            likesCount={currentStory.likesCount}
          />
        </div>
      </div>
    </div>
  );
}
