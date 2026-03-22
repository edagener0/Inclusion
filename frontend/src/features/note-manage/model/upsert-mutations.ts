import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { noteQueries, upsertNote } from '@/entities/note';

export function useUpsertNoteMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertNote,
    onSuccess: () => {
      toast.success('Updated note successfully!');
      navigate({ to: '.', search: { modal: undefined } });
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
    },
    onError: error => {
      console.error(error);
      toast.error('Error while upserting note.');
    },
  });
}
