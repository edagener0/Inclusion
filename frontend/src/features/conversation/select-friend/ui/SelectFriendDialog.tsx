import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Edit } from 'lucide-react';

import { FriendCard, FriendCardSkeleton, friendQueries } from '@/entities/friend';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';

import { useInfiniteScroll } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { CenterSpinner } from '@/shared/ui/spinner';

export function SelectFriendDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    friendQueries.friendsByUsername(session.username),
  );

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const friends = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-10 w-10 rounded-full shadow-md"
        >
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="grid max-h-[90vh] grid-rows-[auto_minmax(0,1fr)] overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Новое сообщение</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full w-full">
          <div className="flex flex-col px-4 pt-2 pb-4">
            {isLoading
              ? Array.from({ length: 80 }).map((_, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <FriendCardSkeleton />
                  </div>
                ))
              : friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="mb-2 cursor-pointer transition-opacity last:mb-0 hover:opacity-80"
                    onClick={() => {
                      setIsOpen(false);
                      navigate({ to: '/messages/$id', params: { id: friend.username } });
                    }}
                  >
                    <FriendCard
                      user={{ username: friend.username, avatar: friend.avatar, id: friend.id }}
                      userAvatarSlot={
                        <UserAvatar avatar={friend.avatar} username={friend.username} />
                      }
                      friendshipManageSlot={null}
                    />
                  </div>
                ))}

            <div
              ref={observerTarget}
              className="text-muted-foreground flex w-full items-center justify-center"
            >
              {isFetchingNextPage && (
                <span className="animate-pulse py-2 text-sm font-medium">
                  <CenterSpinner className="size-4" />
                </span>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
