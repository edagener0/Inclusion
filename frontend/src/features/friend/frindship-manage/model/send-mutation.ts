import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { friendQueries } from '@/entities/friend';

import { sendRequest } from '../api/requests';

export function useSendRequestMutation() {
  const { t } = useTranslation('friend', { keyPrefix: 'request.send' });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: friendQueries.requests.sentById(id).queryKey });
      toast.success(t('success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
