import { type Note, NoteCard, noteQueries } from '@/entities/note';
import { UserAvatar } from '@/entities/user';
import { LikeButton } from '@/features/like-toggle';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card';

type Props = {
  note: Note;
};

export function NoteFullHoverCard({ note }: Props) {
  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger>
        <NoteCard
          note={note}
          avatar={
            <UserAvatar
              className="w-16 h-16"
              avatar={note.user.avatar}
              username={note.user.username}
            />
          }
        />
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" className="w-72">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <p className="text-sm text-foreground whitespace-pre-wrap wrap-break-word">
              {note.content}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            <LikeButton
              entityId={note.id}
              entityType={noteQueries.entityType}
              likesCount={note.likesCount}
              isLiked={note.isLiked}
              queryKey={noteQueries.list().queryKey}
            />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
