import { useQueries } from '@tanstack/react-query';

import { friendQueries } from '@/entities/friend';

import { AcceptRequestButton } from './AcceptRequestButton';
import { CancelRequestButton } from './CancelRequestButton';
import { DeclineRequestButton } from './DeclineRequestButton';
import { RemoveFriendButton } from './RemoveFriendButton';
import { SendRequestButton } from './SendRequestButton';

type Props = {
  userId: number;
  username: string;
  isFriend: boolean;
};

export function FriendshipManageButton({ userId, isFriend, username }: Props) {
  const [
    { data: sent, isLoading: isSentLoading },
    { data: received, isLoading: isReceivedLoading },
  ] = useQueries({
    queries: [
      friendQueries.requests.sentById(userId),
      friendQueries.requests.received.receivedById(userId),
    ],
  });

  if (isFriend) {
    return <RemoveFriendButton userId={userId} username={username} />;
  }
  if (!isSentLoading && sent) return <CancelRequestButton userId={userId} />;
  if (!isReceivedLoading && received) {
    return (
      <div className="flex items-center gap-1.5">
        <AcceptRequestButton userId={userId} username={username} />
        <DeclineRequestButton userId={userId} />
      </div>
    );
  }

  return <SendRequestButton userId={userId} />;
}
