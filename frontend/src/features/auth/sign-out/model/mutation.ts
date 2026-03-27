import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signOut } from '@/entities/session';
import { IS_AUTH_MARKER } from '@/shared/config/constants';

export function useSignOutMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('auth');

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast.success(t('sign-out.success'));

      queryClient.clear();
      localStorage.removeItem(IS_AUTH_MARKER);
      window.location.href = '/sign-in';
    },
    onError: error => {
      console.error(error);
      toast.error(t('sign-out.error'));
    },
  });
}
