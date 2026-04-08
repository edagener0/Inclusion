import { useInfiniteQuery } from '@tanstack/react-query';

import { FriendshipManageButton } from '@/features/friend/frindship-manage';

import { type Friend, FriendCard, FriendCardSkeleton } from '@/entities/friend';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';

import type { AnyInfiniteOptions, PaginatedReturnData } from '@/shared/api';
import { useInfiniteScroll } from '@/shared/lib/hooks';
import { CenterSpinner } from '@/shared/ui/spinner';

type Props = { queryOptions: AnyInfiniteOptions<PaginatedReturnData<Friend>> };

export function FriendList({ queryOptions }: Props) {
  const session = useSession();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(queryOptions);

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const friends = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <FriendCardSkeleton key={i} />)
        : friends.map((f) => (
            <FriendCard
              key={f.id}
              user={f}
              userAvatarSlot={<UserAvatar avatar={f.avatar} username={f.username} />}
              friendshipManageSlot={
                f.id === session.id ? null : (
                  <FriendshipManageButton
                    isFriend={f.isFriend}
                    username={f.username}
                    userId={f.id}
                  />
                )
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
  );
}
