import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteNote, noteQueries } from '@/entities/note';

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Deleted note successfully!');
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
    },
    onError: error => {
      console.error(error);
      toast.error('Error while deleting note.');
    },
  });
}
