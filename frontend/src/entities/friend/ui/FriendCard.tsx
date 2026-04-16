import type { ReactNode } from 'react';

import { Card, CardContent } from '@/shared/ui/card';

type Props = {
  friendSlot: ReactNode;
  friendshipManageSlot: ReactNode;
};

export function FriendCard({ friendSlot, friendshipManageSlot }: Props) {
  return (
    <Card className="border-none bg-zinc-50 dark:bg-zinc-900/40">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">{friendSlot}</div>
        {friendshipManageSlot}
      </CardContent>
    </Card>
  );
}
