import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileQueryKeys } from '@/entities/profile';
import { sessionQueryKey, useStrictSession } from '@/entities/session';

import { updateFullName } from './requests';

export function useUpdateFullName() {
  const client = useQueryClient();
  const user = useStrictSession();

  return useMutation({
    mutationFn: updateFullName,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueryKey });
      client.invalidateQueries({ queryKey: profileQueryKeys.byUsername(user.username) });
      toast('Full name updated succesefully');
    },
  });
}
