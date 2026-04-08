import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteNote, noteQueries } from '@/entities/note';

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('note', { keyPrefix: 'delete' });

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success(t('success'));
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
