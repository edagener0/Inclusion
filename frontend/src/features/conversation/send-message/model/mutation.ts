import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sendMessage } from '../api/requests';
import type { SendMessage } from './schema';

export function useSendMessageMutation(userId: number) {
  const { t } = useTranslation('message', { keyPrefix: 'send' });

  return useMutation({
    mutationFn: (data: SendMessage) => sendMessage(userId, data),
    onSuccess: () => {
      toast.success(t('success'));
    },
    onError: () => {
      toast.error(t('error'));
    },
  });
}
