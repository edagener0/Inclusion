import { type Note, NoteCard } from '@/entities/note';
import { UserAvatar } from '@/entities/user';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card';

import { NoteLikeButton } from './NoteLikeButton';

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
              className="h-16 w-16"
              avatar={note.user.avatar}
              username={note.user.username}
            />
          }
        />
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" className="w-72">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <p className="text-foreground text-sm wrap-break-word whitespace-pre-wrap">
              {note.content}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 pb-0.5">
            <NoteLikeButton isLiked={note.isLiked} likesCount={note.likesCount} noteId={note.id} />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
