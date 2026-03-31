import { useInfiniteQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';

import { storyQueries } from '@/entities/story';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import { StoryViewer } from '@/widgets/stories/story-viewer';

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
      <DialogContent className="p-0 border-none sm:rounded-xl gap-0 z-50 flex flex-col w-full sm:max-w-130 h-dvh sm:h-[95vh] overflow-hidden bg-black shadow-2xl [&>button]:hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>

        <StoryViewer initialId={Number(id)} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
