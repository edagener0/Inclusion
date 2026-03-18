import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import type { Note } from '../model/types';

interface NoteProps {
  note: Note;
}

export function NoteCard({ note }: NoteProps) {
  return (
    <div className="flex flex-col items-center min-w-[70px] relative group cursor-pointer">
      {/* Note Bubble */}
      <div className="absolute -top-1 z-10 bg-background border rounded-full px-2 py-0.5 text-[10px] shadow-sm max-w-[80px] truncate transition-transform group-hover:scale-110">
        {note.content}
      </div>

      <Avatar className="w-14 h-14 border-2 border-primary">
        <AvatarImage src={note.user.avatar || undefined} />
        <AvatarFallback>{note.user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <span className="text-xs mt-1 truncate w-full text-center text-muted-foreground group-hover:text-foreground">
        {note.user.username}
      </span>
    </div>
  );
}
