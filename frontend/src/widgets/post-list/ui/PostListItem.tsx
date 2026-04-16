import { MoreHorizontal } from 'lucide-react';

import { DeletePostMenuItem } from '@/features/post/delete-post';

import { type Post, PostCard } from '@/entities/post';
import { useSession } from '@/entities/session';
import { LinkedUsername } from '@/entities/user';

import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

import { PostLikeButton } from './PostLikeButton';

type Props = {
  post: Post;
};

export function PostListItem({ post }: Props) {
  const user = useSession();
  const isAuthor = user.id === post.user.id;

  const likeButton = (
    <PostLikeButton isLiked={post.isLiked} likesCount={post.likesCount} postId={post.id} />
  );

  const nameSlot = (
    <LinkedUsername
      username={post.user.username}
      className="text-foreground cursor-pointer text-[14px] font-semibold hover:underline"
    />
  );

  if (!isAuthor) return <PostCard post={post} likeSlot={likeButton} nameSlot={nameSlot} />;

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
        <DeletePostMenuItem id={post.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <PostCard post={post} actionsSlot={actionSlot} likeSlot={likeButton} nameSlot={nameSlot} />
  );
}
