import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { signIn } from '@/entities/session';
import { IS_AUTH_MARKER } from '@/shared/config';

export function useSignInMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      localStorage.setItem(IS_AUTH_MARKER, 'true');
      navigate({ to: '/' });
      toast.success('Welcome back!');
    },
    onError: error => {
      console.error(error);
      toast.error('Unable to sign in. Please try again.');
    },
  });
}
