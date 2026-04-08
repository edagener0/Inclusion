import { useQuery } from '@tanstack/react-query';

import { NoteManageDialog } from '@/features/note-manage';

import { NoteCardSkeleton, noteQueries } from '@/entities/note';
import { useSession } from '@/entities/session';

import { NoteFullHoverCard } from './NoteFullHoverCard';

export function NotesSection() {
  const user = useSession();
  const { data: notes, isLoading } = useQuery({
    ...noteQueries.list(),
    select: (notes) => notes.filter((note) => note.user.id !== user.id),
  });

  return (
    <div className="scrollbar-hide flex w-full justify-start gap-4 overflow-x-auto pt-3 pb-2 pl-2">
      {isLoading ? (
        Array.from({ length: 10 }).map((_, i) => <NoteCardSkeleton key={i} />)
      ) : (
        <>
          <NoteManageDialog />

          {notes && notes.length > 0 && (
            <div className="bg-border mx-0 h-16 w-px shrink-0 self-center" />
          )}

          {notes && notes.map((note) => <NoteFullHoverCard key={note.id} note={note} />)}
        </>
      )}
    </div>
  );
}
