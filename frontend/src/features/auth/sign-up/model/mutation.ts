import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { signUp } from '@/entities/session';

export function useSignUpMutation() {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
      toast.success(t('sign-up.success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('sign-up.error'));
    },
  });
}
