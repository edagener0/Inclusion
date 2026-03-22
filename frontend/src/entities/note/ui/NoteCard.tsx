import { type ReactNode, forwardRef } from 'react';

import type { Note } from '../model/types';

interface Props {
  note: Note;
  avatar: ReactNode;
}

export const NoteCard = forwardRef<HTMLDivElement, Props>(({ note, avatar, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="flex flex-col items-center w-24 max-w-24 shrink-0 relative group cursor-pointer"
    >
      <div className="absolute -top-2 z-10 bg-background border rounded-full px-2 py-1 text-[12px]/[16px] shadow-sm max-w-24 truncate transition-transform group-hover:scale-110">
        {note.content}
      </div>

      {avatar}

      <span className="text-sm mt-1 truncate w-full text-center text-muted-foreground group-hover:text-foreground">
        {note.user.username}
      </span>
    </div>
  );
});
NoteCard.displayName = 'NoteCard';
