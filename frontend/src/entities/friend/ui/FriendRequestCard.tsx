import type { ReactNode } from 'react';

import type { UserPreview } from '@/shared/api';
import { Card } from '@/shared/ui/card';

type Props = {
  user: UserPreview;
  userAvatarSlot: ReactNode;
  acceptButtonSlot: ReactNode;
  declineButtonSlot: ReactNode;
};

export function FriendRequestCard({
  user,
  userAvatarSlot,
  acceptButtonSlot,
  declineButtonSlot,
}: Props) {
  return (
    <Card
      key={user.id}
      className="hover:bg-muted/40 flex w-full flex-row items-center justify-between p-3 pt-4 pb-4 shadow-sm transition-colors"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
          {userAvatarSlot}
        </div>
        <div className="flex flex-col truncate">
          <span className="truncate text-sm font-medium">{user.username}</span>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 gap-1">
        {acceptButtonSlot}
        {declineButtonSlot}
      </div>
    </Card>
  );
}
