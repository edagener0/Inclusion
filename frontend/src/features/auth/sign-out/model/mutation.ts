import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signOut } from '@/entities/session';
import { IS_AUTH_MARKER } from '@/shared/config';

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast.success('You’ve been signed out');

      queryClient.clear();
      localStorage.removeItem(IS_AUTH_MARKER);
      window.location.href = '/sign-in';
    },
    onError: error => {
      console.error(error);
      toast.error('Unable to sign out. Please try again');
    },
  });
}
