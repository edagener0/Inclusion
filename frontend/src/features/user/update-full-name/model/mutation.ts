import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sessionQueries, useSession } from '@/entities/session';
import { profileQueries, userQueries } from '@/entities/user';

import { updateFullName } from '../api/requests';

export function useUpdateFullName() {
  const client = useQueryClient();
  const user = useSession();
  const { t } = useTranslation('user', { keyPrefix: 'fullName' });

  return useMutation({
    mutationFn: updateFullName,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      client.invalidateQueries({ queryKey: userQueries.me().queryKey });
      client.invalidateQueries({ queryKey: profileQueries.byUsername(user.username).queryKey });
      toast.success(t('success'));
    },
    onError: () => {
      toast.error(t('error'));
    },
  });
}
