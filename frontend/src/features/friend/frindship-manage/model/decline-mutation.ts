import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { friendQueries } from '@/entities/friend';

import { declineRequest } from '../api/requests';

export function useDeclineRequestMutation() {
  const { t } = useTranslation('friend', { keyPrefix: 'request.decline' });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineRequest,
    onSuccess: (_, id) => {
      queryClient.setQueryData(friendQueries.requests.received.receivedById(id).queryKey, null);
      queryClient.setQueryData(friendQueries.requests.received.received().queryKey, oldData => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(req => req.id !== id),
          })),
        };
      });

      toast.success(t('success'));
    },
    onError: error => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
