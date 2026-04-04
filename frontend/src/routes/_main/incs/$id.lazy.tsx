import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';

import { CommentSection } from '@/widgets/comment-section';
import { IncLikeButton } from '@/widgets/inc-list';

import { IncDetail, incQueries } from '@/entities/inc';
import { UserAvatar } from '@/entities/user';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '@/shared/ui/dialog';
import { CenterSpinner } from '@/shared/ui/spinner';

export const Route = createLazyFileRoute('/_main/incs/$id')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: inc, isLoading } = useQuery(incQueries.detail(Number(id)));

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.history.go(-1);
    }
  };

  if (isLoading) return <CenterSpinner />;
  if (!inc) return null;

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay className="z-100 bg-black/60" />

      <DialogContent className="sm:border-border bg-background z-100 flex h-dvh w-full flex-col gap-0 overflow-hidden border p-0 sm:max-h-[85vh] sm:max-w-2xl sm:rounded-xl">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="flex-1 overflow-hidden">
          <IncDetail
            inc={inc}
            userAvatarSlot={
              <UserAvatar
                avatar={inc.user.avatar}
                username={inc.user.username}
                className="h-10 w-10"
              />
            }
            likeSlot={
              <IncLikeButton incId={inc.id} isLiked={inc.isLiked} likesCount={inc.likesCount} />
            }
            commentsSlot={<CommentSection entityType={incQueries.entityType} entityId={inc.id} />}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
