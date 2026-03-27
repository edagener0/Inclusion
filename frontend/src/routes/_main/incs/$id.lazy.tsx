import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useRouter } from '@tanstack/react-router';

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
import { CommentSection } from '@/widgets/comment-section';
import { IncLikeButton } from '@/widgets/inc-list';

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
      <DialogOverlay className="bg-black/60 z-100" />

      <DialogContent className="p-0 border sm:border-border sm:rounded-xl gap-0 z-100 flex flex-col w-full sm:max-w-2xl h-dvh sm:max-h-[85vh] overflow-hidden bg-background">
        <DialogTitle className="sr-only">Post Detail</DialogTitle>
        <DialogDescription className="sr-only">Details and comments for the post</DialogDescription>

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
