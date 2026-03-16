import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createNote, deleteNote, noteQueries } from '@/entities/note';
import { type Note } from '@/entities/note';

export function useNoteForm(existingNote?: Note) {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setContent(existingNote?.content || '');
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (newContent: string) => {
      return createNote(newContent);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
      setOpen(false);
      toast.success('Nota atualizada!');
    },
    onError: () => {
      toast.error('Erro ao partilhar nota.');
    },
  });

  const { mutate: removeNote, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!existingNote) throw new Error('No note to delete');
      return deleteNote(existingNote.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
      setOpen(false);
      toast.success('Nota apagada!');
    },
    onError: () => {
      toast.error('Erro ao apagar nota.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate(content);
  };

  return {
    content,
    setContent,
    open,
    isPending,
    isDeleting,
    handleSubmit,
    handleOpenChange,
    removeNote,
  };
}
