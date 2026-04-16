import type { ReactNode } from 'react';

import { useTimeAgo } from '@/shared/lib/hooks';

type Props = {
  userSlot: ReactNode;
  createdAt: Date;
};

export function StoryHeader({ createdAt, userSlot }: Props) {
  return (
    <div className="pointer-events-auto flex items-center gap-2">
      {userSlot}
      <span className="font-sm text-sm text-white drop-shadow-md">{useTimeAgo(createdAt)}</span>
    </div>
  );
}
