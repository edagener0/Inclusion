import { useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, useLocation } from '@tanstack/react-router';

import { StoryCard, StoryCardSkeleton, storyQueries } from '@/entities/story';
import { UserAvatar } from '@/entities/user';

import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';

export function StoriesSection() {
  const location = useLocation();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    storyQueries.feed(),
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const stories = data?.pages.flatMap((page) => page.data) ?? [];

  if (!isLoading && !stories.length) return null;

  return (
    <div className="border-border/40 relative mb-4 w-full max-w-2xl border-b">
      <ScrollArea className="w-full cursor-grab mask-[linear-gradient(to_right,black_85%,transparent_100%)] whitespace-nowrap active:cursor-grabbing md:mask-[linear-gradient(to_right,black_90%,transparent_100%)]">
        <div className="flex w-max space-x-4 px-2 py-4 pr-12">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <StoryCardSkeleton key={i} />)
            : stories.map((story) => (
                <Link
                  to="/stories/$id"
                  params={{ id: String(story.stories[0].id) }}
                  search={{ from: location.pathname }}
                  key={story.user.id}
                >
                  <StoryCard
                    username={story.user.username}
                    userAvatarSlot={
                      <UserAvatar
                        className="h-16 w-16"
                        username={story.user.username}
                        avatar={story.user.avatar}
                      />
                    }
                  />
                </Link>
              ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
