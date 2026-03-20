import { useQuery } from '@tanstack/react-query';

import { noteQueries } from '@/entities/note';
import { useStrictSession } from '@/entities/session';
import { NoteManageDialog } from '@/features/note-manage';
import { CenterSpinner } from '@/shared/ui/spinner';

import { NoteFullHoverCard } from './NoteFullHoverCard';

export function NotesSection() {
  const user = useStrictSession();
  const { data: notes, isLoading } = useQuery({
    ...noteQueries.list(),
    select: notes => notes.filter(note => note.user.id !== user.id),
  });

  return (
    <>
      {isLoading ? (
        <CenterSpinner />
      ) : (
        <div className="flex w-full justify-start gap-4 overflow-x-auto pl-2 pt-3 pb-2 scrollbar-hide">
          <NoteManageDialog />

          {notes && notes.length > 0 && (
            <div className="w-px h-16 self-center bg-border shrink-0 mx-0" />
          )}

          {notes && notes.map(note => <NoteFullHoverCard key={note.id} note={note} />)}
        </div>
      )}
    </>
  );
}
