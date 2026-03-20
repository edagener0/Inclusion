import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileQueries } from '@/entities/profile';
import { sessionQueryKey, useStrictSession } from '@/entities/session';

import { updateFullName } from '../api/requests';

export function useUpdateFullName() {
  const client = useQueryClient();
  const user = useStrictSession();

  return useMutation({
    mutationFn: updateFullName,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueryKey });
      client.invalidateQueries({ queryKey: profileQueries.byUsername(user.username).queryKey });
      toast('Full name updated succesefully');
    },
  });
}
