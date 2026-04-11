import { useMemo } from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { notFound, useParams } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { SendMessageInput } from '@/features/conversation/send-message';

import { conversationbQueries, useConversationSocket } from '@/entities/conversation';
import { UserAvatar, profileQueries } from '@/entities/user';

import { useInfiniteScroll } from '@/shared/lib/hooks';
import { CenterSpinner } from '@/shared/ui/spinner';

import { MessageContextMenu } from './MessageContextMenu';

export function ConversationWindow() {
  const { id: username } = useParams({ from: '/_main/messages/$id' });

  const { data: profile, isLoading: isProfileLoading } = useQuery(
    profileQueries.byUsername(username),
  );

  const profileId = profile?.id;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    ...conversationbQueries.messages(profileId ?? 0),
    enabled: !!profileId,
  });

  useConversationSocket(profileId ?? 0);

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const allMessages = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  if (isProfileLoading) {
    return <CenterSpinner />;
  }

  if (!profile) {
    throw notFound();
  }

  if (status === 'pending') return <CenterSpinner />;

  return (
    <div className="bg-background flex h-full w-full flex-col overflow-hidden">
      <div className="bg-background/95 z-10 flex shrink-0 items-center justify-between gap-2 border-b px-2 py-2 backdrop-blur sm:px-4 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3">
          <UserAvatar avatar={profile.avatar} username={profile.username} />
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate text-sm font-semibold">{username}</h2>
          </div>
        </div>
      </div>

      <div className="bg-muted/5 relative flex min-h-0 w-full flex-1 flex-col-reverse overflow-y-auto pr-5 pl-5">
        <div className="mx-auto flex w-full max-w-4xl flex-col-reverse gap-3 p-3 pb-8 sm:gap-4 sm:p-4">
          {allMessages.map((msg) => (
            <MessageContextMenu key={msg.id} message={msg} />
          ))}

          <div ref={observerTarget} className="h-4 w-full shrink-0">
            {isFetchingNextPage && <Loader2 className="mx-auto h-4 w-4 animate-spin opacity-50" />}
          </div>
        </div>
      </div>

      <div className="bg-background shrink-0 border-t p-2 sm:p-4">
        <SendMessageInput userId={profile.id} />
      </div>
    </div>
  );
}
