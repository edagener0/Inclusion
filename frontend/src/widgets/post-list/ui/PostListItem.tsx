import { MoreHorizontal } from 'lucide-react';

import { type Post, PostCard } from '@/entities/post';
import { useStrictSession } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

export function PostListItem({ post }: { post: Post }) {
  const currentUser = useStrictSession();
  const isAuthor = currentUser?.id === post.user.id;

  if (!isAuthor) return <PostCard post={post} />;

  const actionSlot = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end"></DropdownMenuContent>
    </DropdownMenu>
  );

  return <PostCard post={post} actions={actionSlot} />;
}
