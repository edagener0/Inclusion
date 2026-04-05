import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileQueries } from '@/entities/user';

import { removeFriend } from '../api/requests';
import { useSetFriendStatus } from './use-update-user';

type Params = {
  userId: number;
  username: string;
};

export function useRemoveFriendMutation() {
  const { t } = useTranslation('friend', { keyPrefix: 'request.remove' });
  const { setFriendStatus } = useSetFriendStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: Params) => removeFriend(userId),
    onSuccess: (_, { username, userId }) => {
      queryClient.invalidateQueries({ queryKey: profileQueries.byUsername(username).queryKey });
      setFriendStatus(userId, false);

      toast.success(t('success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
