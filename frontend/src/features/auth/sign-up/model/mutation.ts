import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { signUp } from '@/entities/session';

export function useSignUpMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate({ to: '/sign-in' });
      toast.success('Account created successfully');
    },
    onError: error => {
      console.error(error);
      toast.error('Unable to create account. Please try again.');
    },
  });
}
