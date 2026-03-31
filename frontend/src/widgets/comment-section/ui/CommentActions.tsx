import { MoreHorizontal } from 'lucide-react';

import type { Comment } from '@/entities/comment';
import { DeleteCommentMenuItem } from '@/features/comment/delete-comment';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

type Props = {
  comment: Comment;
  entityId: number;
  entityType: string;
};

export function CommentActions({ comment, entityId, entityType }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-110 min-w-(--radix-dropdown-menu-trigger-width) w-max"
      >
        <DeleteCommentMenuItem commentId={comment.id} entityId={entityId} entityType={entityType} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
