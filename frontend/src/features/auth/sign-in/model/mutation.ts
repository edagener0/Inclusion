import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { signIn } from '@/entities/session';

import { IS_AUTH_MARKER } from '@/shared/config';

export function useSignInMutation() {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      localStorage.setItem(IS_AUTH_MARKER, 'true');
      navigate({ to: '/' });
      toast.success(t('sign-in.success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('sign-in.error'));
    },
  });
}
