import type { ReactNode } from 'react';

import type { Note } from '../model/types';

interface Props {
  note: Note;
  avatar: ReactNode;
}

export function NoteCard({ note, avatar }: Props) {
  return (
    <div className="flex flex-col items-center min-w-17.5 relative group cursor-pointer">
      <div className="absolute -top-1 z-10 bg-background border rounded-full px-2 py-0.5 text-[10px] shadow-sm max-w-20 truncate transition-transform group-hover:scale-110">
        {note.content}
      </div>

      {avatar}

      <span className="text-xs mt-1 truncate w-full text-center text-muted-foreground group-hover:text-foreground">
        {note.user.username}
      </span>
    </div>
  );
}
