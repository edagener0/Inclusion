import { useInfiniteQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';

import { StoryViewer } from '@/widgets/stories/story-viewer';

import { storyQueries } from '@/entities/story';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';

export const Route = createLazyFileRoute('/_main/stories/$id')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { id } = Route.useParams();
  const { from } = Route.useSearch();
  const navigate = useNavigate();
  useInfiniteQuery(storyQueries.feed());

  const handleClose = () => navigate({ to: from });

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="z-50 flex h-dvh w-full flex-col gap-0 overflow-hidden border-none bg-black p-0 shadow-2xl sm:h-[95vh] sm:max-w-130 sm:rounded-xl [&>button]:hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <StoryViewer initialId={Number(id)} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
