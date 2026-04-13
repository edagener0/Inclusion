import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteMessage } from '../api/requests';

export function useDeleteMessageMutation() {
  const { t } = useTranslation('message', { keyPrefix: 'delete' });

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      toast.success(t('success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
