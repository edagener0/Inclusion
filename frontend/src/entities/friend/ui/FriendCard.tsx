import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';

import type { UserPreview } from '@/shared/api';
import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  user: UserPreview;
  userAvatarSlot: ReactNode;
  friendshipManageSlot: ReactNode;
};

export function FriendCard({ user, userAvatarSlot, friendshipManageSlot }: Props) {
  return (
    <Card className="border-none bg-zinc-50 dark:bg-zinc-900/40">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {userAvatarSlot}
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              <Link
                to="/$username"
                params={{ username: user.username }}
                className="cursor-pointer hover:underline"
              >
                {user.username}
              </Link>
            </h4>
          </div>
        </div>
        {friendshipManageSlot}
      </CardContent>
    </Card>
  );
}
