import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { sessionQueries, signIn } from '@/entities/session';

import { IS_AUTH_MARKER } from '@/shared/config';

export function useSignInMutation() {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      localStorage.setItem(IS_AUTH_MARKER, 'true');
      queryClient.removeQueries({ queryKey: sessionQueries.me().queryKey });
      navigate({ to: '/' });
      toast.success(t('sign-in.success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('sign-in.error'));
    },
  });
}
