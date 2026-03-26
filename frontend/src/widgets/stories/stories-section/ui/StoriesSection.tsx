import { useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, useLocation } from '@tanstack/react-router';

import { StoryCard, storyQueries } from '@/entities/story';
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

  const stories = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="relative w-full max-w-2xl mb-4 border-b border-border/40">
      <ScrollArea className="w-full whitespace-nowrap mask-[linear-gradient(to_right,black_85%,transparent_100%)] md:mask-[linear-gradient(to_right,black_90%,transparent_100%)] cursor-grab active:cursor-grabbing">
        <div className="flex w-max space-x-4 px-2 py-4 pr-12">
          {isLoading ? (
            <>Loading..</>
          ) : (
            stories.map(story => (
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
                      className="w-16 h-16"
                      username={story.user.username}
                      avatar={story.user.avatar}
                    />
                  }
                />
              </Link>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
