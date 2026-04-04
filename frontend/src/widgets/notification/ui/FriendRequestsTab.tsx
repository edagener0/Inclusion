import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useInfiniteQuery } from '@tanstack/react-query';

import { AcceptRequestButton, DeclineRequestButton } from '@/features/friend/frindship-manage';

import { FriendRequestCard, friendQueries } from '@/entities/friend';
import { UserAvatar } from '@/entities/user';

import { useInfiniteScroll } from '@/shared/lib/hooks';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { CenterSpinner } from '@/shared/ui/spinner';
import { TabsContent } from '@/shared/ui/tabs';

import { useNotificationCountStore } from '../model/store';

export function FriendRequestsTab() {
  const { t } = useTranslation('common', { keyPrefix: 'notification' });
  const setFriendsCount = useNotificationCountStore((s) => s.setFriends);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    ...friendQueries.requests.received.received(),
    throwOnError: false,
  });

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const allRequests = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!isLoading && data) {
      setFriendsCount(allRequests.length);
    }
  }, [setFriendsCount, allRequests.length, data, isLoading]);

  return (
    <TabsContent value="requests" className="m-0 border-none outline-none">
      <ScrollArea className="h-80">
        <div className="flex flex-col gap-2 p-4">
          {isLoading ? (
            <span className="animate-pulse text-sm font-medium">
              <CenterSpinner className="size-4" />
            </span>
          ) : allRequests.length === 0 ? (
            <p className="text-muted-foreground mt-8 text-center text-sm">{t('requests.empty')}</p>
          ) : (
            <>
              {allRequests.map((req) => (
                <FriendRequestCard
                  key={req.id}
                  user={req}
                  userAvatarSlot={<UserAvatar username={req.username} avatar={req.avatar} />}
                  acceptButtonSlot={<AcceptRequestButton userId={req.id} username={req.username} />}
                  declineButtonSlot={<DeclineRequestButton userId={req.id} />}
                />
              ))}

              <div ref={observerTarget} className="h-4 w-full" />

              {isFetchingNextPage && (
                <span className="animate-pulse text-sm font-medium">
                  <CenterSpinner className="size-4" />
                </span>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  );
}
