import { type Note } from '@/entities/note';
import { useStrictSession } from '@/entities/session';
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

export function NoteForm({ existingNote }: CreateNoteFormProps) {
  const data = useStrictSession();

  const { form, open, handleOpenChange, isPending, isDeleting, removeNote } =
    useNoteForm(existingNote);
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center min-w-[70px] gap-1 relative group outline-none">
          <div
            className={`absolute -top-1 z-10 bg-background border rounded-full px-2 py-0.5 text-[10px] shadow-sm max-w-[80px] truncate transition-all ${existingNote ? 'border-primary text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
          >
            {existingNote ? existingNote.content : 'What are you thinking?'}
          </div>

          <Avatar
            className={`w-14 h-14 border-2 transition-all ${existingNote ? 'border-primary' : 'border-muted-foreground/50 group-hover:border-primary'}`}
          >
            <AvatarImage src={data.avatar || undefined} />
            <AvatarFallback>{data.username?.[0] || '?'}</AvatarFallback>
          </Avatar>

          <span className="text-xs mt-1 truncate w-full text-center text-muted-foreground group-hover:text-foreground font-medium">
            {existingNote ? 'Your note' : 'Creating note'}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existingNote ? 'Edit note' : 'Share what your thinking'}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 mt-2"
        >
          <form.Field
            name="content"
            children={field => (
              <Textarea
                placeholder="Diga o que está a pensar... (máx 100 chars)"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                maxLength={100}
                className="resize-none"
                disabled={isPending || isDeleting}
                rows={3}
              />
            )}
          />
          <div className="flex justify-between items-center gap-2">
            <div>
              {existingNote && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeNote()}
                  disabled={isPending || isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={state =>
                  [state.canSubmit, state.isSubmitting, state.values.content] as const
                }
                children={([canSubmit, isSubmitting, content]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isPending || !content.trim()}
                  >
                    {isPending || isSubmitting ? 'Sharing...' : existingNote ? 'Update' : 'Share'}
                  </Button>
                )}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
