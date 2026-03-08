import { useQuery } from '@tanstack/react-query';
import { noteQueries } from '@/entities/note';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';

function MessagesLayout() {
  // 1. Fetch the notes using our query
  const { data: notes, isLoading, isError } = useQuery(noteQueries.list());

  if (isLoading) return <div>Loading notes...</div>;

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        
        {/* 2. Map through the notes to render the avatars */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {notes?.map((note) => (
            <div key={note.id} className="flex flex-col items-center min-w-[70px] relative">
              {/* The Note Bubble */}
              <div className="absolute -top-1 z-10 bg-background border rounded-full px-2 py-0.5 text-[10px] shadow-sm max-w-[80px] truncate">
                {note.content}
              </div>
              
              {/* User Avatar */}
              <Avatar className="w-14 h-14 border-2 border-primary">
                <AvatarImage src={note.user.avatar || undefined} />
                <AvatarFallback>{note.user.username[0]}</AvatarFallback>
              </Avatar>
              
              <span className="text-xs mt-1 truncate w-full text-center">
                {note.user.username}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}