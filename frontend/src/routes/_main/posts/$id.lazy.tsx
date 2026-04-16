import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';

import { CommentSection } from '@/widgets/comment-section';
import { PostLikeButton } from '@/widgets/post-list';

import { postQueries } from '@/entities/post';
import { PostDetail } from '@/entities/post/ui/PostDetail';

import { BaseAvatar } from '@/shared/ui/base-avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '@/shared/ui/dialog';
import { CenterSpinner } from '@/shared/ui/spinner';

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
      <DialogOverlay className="z-100 bg-black/80" />

      <DialogContent className="z-100 flex h-dvh max-h-dvh w-full max-w-[100vw] justify-center gap-0 overflow-hidden border-none p-0 shadow-none sm:max-w-[calc(100vw-2rem)] md:h-fit md:max-h-[90vh] md:w-max">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <PostDetail
          post={post}
          userAvatarSlot={
            <BaseAvatar src={post.user.avatar} alt={post.user.username} className="h-8 w-8" />
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
