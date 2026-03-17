import { MoreHorizontal } from 'lucide-react';

import { type Post, PostCard } from '@/entities/post';
import { useStrictSession } from '@/entities/session';
import { DeletePostMenuItem } from '@/features/post/delete-post';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

import { LikeButton } from './LikeButton';

export function PostListItem({ post }: { post: Post }) {
  const currentUser = useStrictSession();
  const isAuthor = currentUser?.id === post.user.id;

  if (!isAuthor) return <PostCard post={post} likeSlot={<LikeButton post={post} />} />;

  const actionSlot = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DeletePostMenuItem id={post.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return <PostCard post={post} actionsSlot={actionSlot} likeSlot={<LikeButton post={post} />} />;
}
