import { type Note } from '@/entities/note';
import { useSession } from '@/entities/session';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';

import { useNoteForm } from '../model/hook';

interface CreateNoteFormProps {
  existingNote?: Note;
}

export function CreateNoteForm({ existingNote }: CreateNoteFormProps) {
  const { data: user } = useSession();
  const {
    content,
    setContent,
    open,
    handleOpenChange,
    isPending,
    isDeleting,
    handleSubmit,
    removeNote,
  } = useNoteForm(existingNote);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center min-w-[70px] relative group outline-none">
          <div
            className={`absolute -top-1 z-10 bg-background border rounded-full px-2 py-0.5 text-[10px] shadow-sm max-w-[80px] truncate transition-all ${existingNote ? 'border-primary text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
          >
            {existingNote ? existingNote.content : 'O que estás a pensar?'}
          </div>

          <Avatar
            className={`w-14 h-14 border-2 transition-all ${existingNote ? 'border-primary' : 'border-muted-foreground/50 group-hover:border-primary'}`}
          >
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback>{user?.username?.[0] || '?'}</AvatarFallback>
          </Avatar>

          <span className="text-xs mt-1 truncate w-full text-center text-muted-foreground group-hover:text-foreground font-medium">
            {existingNote ? 'Sua nota' : 'Criar nota'}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existingNote ? 'Editar nota' : 'Partilhe o que está a pensar'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <Textarea
            placeholder="Diga o que está a pensar... (máx 100 chars)"
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={100}
            className="resize-none"
            disabled={isPending}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            {existingNote && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeNote()}
                disabled={isPending || isDeleting}
              >
                {isDeleting ? 'A remover...' : 'Delete'}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !content.trim()}>
              {isPending ? 'A partilhar...' : existingNote ? 'Atualizar' : 'Partilhar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
