import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sendMessage } from '../api/requests';

export function useSendMessageMutation() {
  const { t } = useTranslation('message', { keyPrefix: 'send' });

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      toast.success(t('success'));
    },
    onError: () => {
      toast.error(t('error'));
    },
  });
}
