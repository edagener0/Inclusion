import { MoreHorizontal } from 'lucide-react';

import { DeleteIncMenuItem } from '@/features/inc/delete-inc';

import { type Inc, IncCard } from '@/entities/inc';
import { useSession } from '@/entities/session';
import { UserSnippet } from '@/entities/user';

import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

import { IncLikeButton } from './IncLikeButton';

export function IncListItem({ inc }: { inc: Inc }) {
  const user = useSession();
  const isAuthor = user.id === inc.user.id;

  const likeButton = (
    <IncLikeButton isLiked={inc.isLiked} likesCount={inc.likesCount} incId={inc.id} />
  );

  const author = <UserSnippet user={inc.user} />;

  if (!isAuthor) return <IncCard inc={inc} likeSlot={likeButton} authorSlot={author} />;

  const actionSlot = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-max min-w-(--radix-dropdown-menu-trigger-width)"
      >
        <DeleteIncMenuItem id={inc.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return <IncCard inc={inc} actionsSlot={actionSlot} likeSlot={likeButton} authorSlot={author} />;
}
