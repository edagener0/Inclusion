import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { NoteCard, noteQueries } from '@/entities/note';
import { useSession } from '@/entities/session';
import { CreateNoteForm } from '@/features/note/manage-note';

export const Route = createFileRoute('/_main/messages')({
  component: MessagesLayout,
});

function MessagesLayout() {
  // 1. Fetch the notes using our query
  const { data: notes, isLoading } = useQuery(noteQueries.list());
  const { data: session } = useSession();

  if (isLoading) return <div>Loading notes...</div>;

  const myNote = notes?.find(note => note.user.id === session?.id);

  const otherNotes = notes?.filter(note => note.user.id !== session?.id) || [];

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Messages</h2>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <CreateNoteForm existingNote={myNote} />

          {otherNotes.length > 0 ? (
            otherNotes.map(note => <NoteCard key={note.id} note={note} />)
          ) : (
            <p className="text-xs text-muted-foreground">No notes in the last 24h</p>
          )}
        </div>
      </div>
    </div>
  );
}
