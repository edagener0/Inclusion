import { type ReactNode, forwardRef } from 'react';

import type { Note } from '../model/schema';

interface Props {
  note: Note;
  avatar: ReactNode;
}

export const NoteCard = forwardRef<HTMLDivElement, Props>(({ note, avatar, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="group relative flex w-24 max-w-24 shrink-0 cursor-pointer flex-col items-center"
    >
      <div className="bg-background absolute -top-2 z-10 max-w-24 truncate rounded-full border px-2 py-1 text-[12px]/[16px] shadow-sm transition-transform group-hover:scale-110">
        {note.content}
      </div>

      {avatar}

      <span className="text-muted-foreground group-hover:text-foreground mt-1 w-full truncate text-center text-sm">
        {note.user.username}
      </span>
    </div>
  );
});
NoteCard.displayName = 'NoteCard';
