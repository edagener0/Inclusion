import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';

import { postQueries } from '@/entities/post';
import { PostDetail } from '@/entities/post/ui/PostDetail';
import { UserAvatar } from '@/entities/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '@/shared/ui/dialog';
import { CenterSpinner } from '@/shared/ui/spinner';
import { CommentSection } from '@/widgets/comment-section';
import { PostLikeButton } from '@/widgets/post-list';

export const Route = createLazyFileRoute('/_main/posts/$id')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: post, isLoading } = useQuery(postQueries.detail(Number(id)));

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.history.go(-1);
    }
  };

  if (isLoading) return <CenterSpinner />;
  if (!post) return null;

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-black/80 z-100" />

      <DialogContent className="p-0 border-none hadow-none gap-0 z-100 flex justify-center w-full md:w-max max-w-[100vw] sm:max-w-[calc(100vw-2rem)] h-dvh md:h-fit max-h-dvh md:max-h-[90vh] overflow-hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <PostDetail
          post={post}
          userAvatarSlot={
            <UserAvatar
              avatar={post.user.avatar}
              username={post.user.username}
              className="h-8 w-8"
            />
          }
          likeSlot={
            <PostLikeButton isLiked={post.isLiked} likesCount={post.likesCount} postId={post.id} />
          }
          commentsSlot={<CommentSection entityType={postQueries.entityType} entityId={post.id} />}
        />
      </DialogContent>
    </Dialog>
  );
}
