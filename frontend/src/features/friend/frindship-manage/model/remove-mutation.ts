import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileQueries } from '@/entities/user';

import { removeFriend } from '../api/requests';

type Params = {
  userId: number;
  username: string;
};

export function useRemoveFriendMutation() {
  const { t } = useTranslation('friend', { keyPrefix: 'request.remove' });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: Params) => removeFriend(userId),
    onSuccess: (_, { username }) => {
      queryClient.invalidateQueries({ queryKey: profileQueries.byUsername(username).queryKey });
      toast.success(t('success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
