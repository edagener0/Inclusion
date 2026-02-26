import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileQueryKeys } from '@/entities/profile';
import { sessionQueryKey, useStrictSession } from '@/entities/session';

import { updateBio } from './requests';

export function useUpdateBio() {
  const client = useQueryClient();
  const user = useStrictSession();

  return useMutation({
    mutationFn: updateBio,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueryKey });
      client.invalidateQueries({ queryKey: profileQueryKeys.byUsername(user.username) });
      toast.success('Biography updated succesefully');
    },
  });
}
