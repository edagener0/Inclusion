import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { friendQueries } from '@/entities/friend';

import { cancelRequest } from '../api/requests';

export function useCancelRequestMutation() {
  const { t } = useTranslation('friend', { keyPrefix: 'request.cancel' });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelRequest,
    onSuccess: (_, id) => {
      queryClient.setQueryData(friendQueries.requests.sentById(id).queryKey, null);
      toast.success(t('success'));
    },
    onError: error => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
