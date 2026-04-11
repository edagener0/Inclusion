import { useInfiniteQuery } from '@tanstack/react-query';

import {
  ConversationCard,
  ConversationCardSkeleton,
  conversationbQueries,
} from '@/entities/conversation';
import { UserAvatar } from '@/entities/user';

import { useInfiniteScroll } from '@/shared/lib/hooks';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { CenterSpinner } from '@/shared/ui/spinner';

export function ConversationList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    conversationbQueries.feed(),
  );

  const { observerTarget } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  const conversations = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <ScrollArea className="w-full flex-1">
        <div className="flex flex-col">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ConversationCardSkeleton key={i} />)
            : conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  avatarSlot={
                    <UserAvatar
                      avatar={conversation.user.avatar}
                      username={conversation.user.username}
                    />
                  }
                />
              ))}

          <div
            ref={observerTarget}
            className="text-muted-foreground flex w-full items-center justify-center py-6"
          >
            {isFetchingNextPage && (
              <span className="animate-pulse text-sm font-medium">
                <CenterSpinner className="size-4" />
              </span>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
