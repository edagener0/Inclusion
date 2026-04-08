import type { ReactNode } from 'react';

import type { UserPreview } from '@/shared/api';
import { useTimeAgo } from '@/shared/lib/hooks';

type Props = {
  user: UserPreview;
  userAvatarSlot: ReactNode;
  createdAt: Date;
};

export function StoryHeader({ createdAt, user, userAvatarSlot }: Props) {
  return (
    <div className="pointer-events-auto flex items-center gap-2">
      {userAvatarSlot}
      <span className="text-sm font-medium text-white drop-shadow-md">{user.username}</span>
      <span className="font-sm text-sm text-white drop-shadow-md">{useTimeAgo(createdAt)}</span>
    </div>
  );
}
