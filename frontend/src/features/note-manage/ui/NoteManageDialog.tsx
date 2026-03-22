import { useState } from 'react';

import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';

import { NoteCard, noteQueries } from '@/entities/note';
import { useSession } from '@/entities/session';
import { UserAvatar } from '@/entities/user';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';

import { useDeleteNoteMutation } from '../model/delete-mutations';
import { type UpsertNote, emptyNote, upsertNoteSchema } from '../model/schema';
import { useUpsertNoteMutation } from '../model/upsert-mutations';

export function NoteManageDialog() {
  const user = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { data: note } = useQuery({
    ...noteQueries.list(),
    select: allNotes => allNotes.find(n => n.user.id === user.id),
  });

  const upsertMutation = useUpsertNoteMutation();
  const deleteMutation = useDeleteNoteMutation();

  const form = useForm({
    defaultValues: { content: note?.content ?? '' } as UpsertNote,
    validators: { onChange: upsertNoteSchema },
    onSubmit: async ({ value }) => {
      await upsertMutation.mutateAsync(value.content);
      form.reset();
      setIsOpen(false);
    },
  });

  const handleDelete = async () => {
    if (!note) return;

    await deleteMutation.mutateAsync(note.id, { onSuccess: () => form.reset() });
    setIsOpen(false);
  };

  const isPending = upsertMutation.isPending || deleteMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <NoteCard
          note={note ?? emptyNote(user.avatar, user.username)}
          avatar={
            <UserAvatar className="w-16 h-16" avatar={user.avatar} username={user.username} />
          }
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? 'Edit note' : 'Share what your thinking'}</DialogTitle>
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
              <div className="flex flex-col w-full relative mb-1">
                <Textarea
                  placeholder="Tell me what you're thinking..."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className={cn(
                    'pr-10 transition-all resize-none break-all',
                    (field.state.meta.isTouched || field.state.meta.errors.length > 0) &&
                      field.state.meta.errors.length > 0 &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                  disabled={isPending}
                  rows={3}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="absolute -bottom-5 left-0 text-[10px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                    {field.state.meta.errors[0]?.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
          <div className="flex justify-between items-center gap-2">
            <div>
              {note && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
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
                    {upsertMutation.isPending || isSubmitting
                      ? 'Sharing...'
                      : note
                        ? 'Update'
                        : 'Share'}
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
