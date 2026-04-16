import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';

import { NoteCard, noteQueries } from '@/entities/note';
import { useSession } from '@/entities/session';

import { BaseAvatar } from '@/shared/ui/base-avatar';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { FieldError } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';

import { useDeleteNoteMutation } from '../model/delete-mutations';
import { type UpsertNote, UpsertNoteSchema, emptyNote } from '../model/schema';
import { useUpsertNoteMutation } from '../model/upsert-mutations';

export function NoteManageDialog() {
  const user = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(['note', 'common']);

  const { data: note } = useQuery({
    ...noteQueries.list(),
    select: (allNotes) => allNotes.find((n) => n.user.id === user.id),
  });

  const upsertMutation = useUpsertNoteMutation();
  const deleteMutation = useDeleteNoteMutation();

  const form = useForm({
    defaultValues: { content: note?.content ?? '' } as UpsertNote,
    validators: { onChange: UpsertNoteSchema },
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
          note={note ?? { ...emptyNote(user), content: t(emptyNote(user).content) }}
          avatar={<BaseAvatar className="h-16 w-16" src={user.avatar} alt={user.username} />}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? t('edit.title') : t('create.default')}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-2 flex flex-col gap-4"
        >
          <form.Field
            name="content"
            children={(field) => (
              <div className="relative mb-1 flex w-full flex-col">
                <Textarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="resize-none pr-10 break-all transition-all"
                  disabled={isPending}
                  rows={3}
                />

                <FieldError errors={field.state.meta.errors} className="text-xs" />
              </div>
            )}
          />
          <div className="flex items-center justify-between gap-2">
            <div>
              {note && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {deleteMutation.isPending
                    ? t('common:actions.deleting')
                    : t('common:actions.delete')}
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
                {t('common:actions.cancel')}
              </Button>

              <form.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting, state.values.content] as const
                }
                children={([canSubmit, isSubmitting, content]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isPending || !content.trim()}
                  >
                    {upsertMutation.isPending || isSubmitting
                      ? t('common:actions.publishing')
                      : note
                        ? t('common:actions.update')
                        : t('common:actions.publish')}
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
