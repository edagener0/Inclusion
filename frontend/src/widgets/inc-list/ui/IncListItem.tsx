import { MoreHorizontal } from 'lucide-react';

import { type Inc, IncCard, incQueries } from '@/entities/inc';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';
import { DeleteIncMenuItem } from '@/features/inc/delete-inc';
import { LikeButton } from '@/features/like-toggle';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

export function IncListItem({ inc }: { inc: Inc }) {
  const user = useSession();
  const isAuthor = user.id === inc.user.id;

  const likeButton = (
    <LikeButton
      queryKey={incQueries.feed().queryKey}
      likesCount={inc.likesCount}
      entityId={inc.id}
      entityType={incQueries.entityType}
      isLiked={inc.isLiked}
    />
  );

  const userAvatar = (
    <UserAvatar avatar={inc.user.avatar} username={inc.user.username} className="h-9 w-9" />
  );

  if (!isAuthor) return <IncCard inc={inc} likeSlot={likeButton} userAvatarSlot={userAvatar} />;

  const actionSlot = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DeleteIncMenuItem id={inc.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <IncCard inc={inc} actionsSlot={actionSlot} likeSlot={likeButton} userAvatarSlot={userAvatar} />
  );
}
