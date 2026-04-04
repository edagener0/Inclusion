import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { friendQueries } from '@/entities/friend';
import { profileQueries } from '@/entities/user';

import { acceptRequest } from '../api/requests';

type Params = {
  userId: number;
  username: string;
};

export function useAcceptRequestMutation() {
  const { t } = useTranslation('friend', { keyPrefix: 'request.accept' });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: Params) => acceptRequest(userId),
    onSuccess: (_, { userId, username }) => {
      queryClient.setQueryData(friendQueries.requests.received.receivedById(userId).queryKey, null);
      queryClient.invalidateQueries({ queryKey: profileQueries.byUsername(username).queryKey });
      queryClient.setQueryData(friendQueries.requests.received.received().queryKey, oldData => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(req => req.id !== userId),
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
