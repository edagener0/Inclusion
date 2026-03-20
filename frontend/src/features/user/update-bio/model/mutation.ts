import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileQueries } from '@/entities/profile';
import { sessionQueryKey, useStrictSession } from '@/entities/session';

import { updateBio } from '../api/requests';

export function useUpdateBio() {
  const client = useQueryClient();
  const user = useStrictSession();

  return useMutation({
    mutationFn: updateBio,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueryKey });
      client.invalidateQueries({ queryKey: profileQueries.byUsername(user.username).queryKey });
      toast.success('Biography updated succesefully');
    },
  });
}
