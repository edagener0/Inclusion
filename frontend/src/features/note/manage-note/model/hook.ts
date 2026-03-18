import { useState } from 'react';

import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createNote, deleteNote, noteQueries } from '@/entities/note';
import { type Note } from '@/entities/note';

export function useNoteForm(existingNote?: Note) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: shareNote, isPending: isSharing } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
      setOpen(false);
      toast.success(existingNote ? 'Note updated!' : 'Note Shared');
    },
    onError: () => {
      toast.error('Error sharing the note.');
    },
  });

  const { mutate: removeNote, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      if (!existingNote) throw new Error('No note to delete');
      return deleteNote(existingNote.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
      setOpen(false);
      toast.success('Note deleted!');
    },
    onError: () => {
      toast.error('Error deleting the note.');
    },
  });

  const form = useForm({
    defaultValues: {
      content: existingNote?.content || '',
    },
    onSubmit: async ({ value }) => {
      shareNote(value.content);
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      form.reset();
    }
  };

  return {
    form,
    open,
    isPending: isSharing,
    isDeleting,
    handleOpenChange,
    removeNote,
  };
}
