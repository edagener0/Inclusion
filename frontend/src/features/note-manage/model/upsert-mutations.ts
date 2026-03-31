import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { noteQueries, upsertNote } from '@/entities/note';

export function useUpsertNoteMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('note', { keyPrefix: 'create' });

  return useMutation({
    mutationFn: upsertNote,
    onSuccess: () => {
      toast.success(t('success'));
      navigate({ to: '.', search: { modal: undefined } });
      queryClient.invalidateQueries({ queryKey: noteQueries.all() });
    },
    onError: error => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
