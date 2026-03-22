import { MoreHorizontal } from 'lucide-react';

import { type Post, PostCard, postQueries } from '@/entities/post';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';
import { LikeButton } from '@/features/like-toggle';
import { DeletePostMenuItem } from '@/features/post/delete-post';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

export function PostListItem({ post }: { post: Post }) {
  const user = useSession();
  const isAuthor = user.id === post.user.id;

  const likeButton = (
    <LikeButton
      queryKey={postQueries.feed().queryKey}
      likesCount={post.likesCount}
      entityId={post.id}
      entityType={postQueries.entityType}
      isLiked={post.isLiked}
    />
  );

  const userAvatar = (
    <UserAvatar avatar={post.user.avatar} username={post.user.username} className="h-9 w-9" />
  );

  if (!isAuthor) return <PostCard post={post} likeSlot={likeButton} userAvatarSlot={userAvatar} />;

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

  return (
    <PostCard
      post={post}
      actionsSlot={actionSlot}
      likeSlot={likeButton}
      userAvatarSlot={userAvatar}
    />
  );
}
