import type { ReactNode } from 'react';

import type { UserPreview } from '@/shared/api';

type Props = {
  user: UserPreview;
  userAvatarSlot: ReactNode;
};

export function StoryHeader({ user, userAvatarSlot }: Props) {
  return (
    <div className="flex items-center gap-2 pointer-events-auto">
      {userAvatarSlot}
      <span className="text-white font-medium text-sm drop-shadow-md">{user.username}</span>
    </div>
  );
}
