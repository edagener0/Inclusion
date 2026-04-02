import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sendRequest } from '../api/requests';

export function useSendFriendRequestMutation() {
  const { t } = useTranslation('friend', { keyPrefix: 'requests' });

  return useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      toast.success(t('success'));
    },
    onError: error => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
