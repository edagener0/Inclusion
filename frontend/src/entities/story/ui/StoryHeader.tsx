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
    <div className="flex items-center gap-2 pointer-events-auto">
      {userAvatarSlot}
      <span className="text-white font-medium text-sm drop-shadow-md">{user.username}</span>
      <span className="text-white font-sm text-sm drop-shadow-md">{useTimeAgo(createdAt)}</span>
    </div>
  );
}
