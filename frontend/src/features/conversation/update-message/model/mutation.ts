import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateMessage } from '../api/requests';
import type { UpdateMessage } from './schema';

export function useUpdateMessageMutation(messageId: number) {
  const { t } = useTranslation('message', { keyPrefix: 'update' });

  return useMutation({
    mutationFn: (data: UpdateMessage) => updateMessage(messageId, data),
    onSuccess: () => {
      toast.success(t('success'));
    },
    onError: () => {
      toast.error(t('error'));
    },
  });
}
