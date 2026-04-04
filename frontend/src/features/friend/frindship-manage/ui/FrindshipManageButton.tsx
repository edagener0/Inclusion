import { useQueries } from '@tanstack/react-query';

import { friendQueries } from '@/entities/friend';
import type { Profile } from '@/entities/user';

import { AcceptRequestButton } from './AcceptRequestButton';
import { CancelRequestButton } from './CancelRequestButton';
import { DeclineRequestButton } from './DeclineRequestButton';
import { RemoveFriendButton } from './RemoveFriendButton';
import { SendRequestButton } from './SendRequestButton';

type Props = {
  profile: Profile;
};

export function FriendshipManageButton({ profile }: Props) {
  const [
    { data: sent, isLoading: isSentLoading },
    { data: received, isLoading: isReceivedLoading },
  ] = useQueries({
    queries: [
      {
        ...friendQueries.requests.sentById(profile?.id as number),
        enabled: !!profile?.id,
      },
      {
        ...friendQueries.requests.received.receivedById(profile?.id as number),
        enabled: !!profile?.id,
      },
    ],
  });

  if (profile.isFriend) {
    return <RemoveFriendButton userId={profile.id} username={profile.username} />;
  }
  if (!isSentLoading && sent) return <CancelRequestButton userId={profile.id} />;
  if (!isReceivedLoading && received) {
    return (
      <div className="flex items-center gap-1.5">
        <AcceptRequestButton userId={profile.id} username={profile.username} />
        <DeclineRequestButton userId={profile.id} />
      </div>
    );
  }

  return <SendRequestButton userId={profile.id} />;
}
