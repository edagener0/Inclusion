import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sessionQueries, useSession } from '@/entities/session';
import { profileQueries, userQueries } from '@/entities/user';

import { updateBio } from '../api/requests';

export function useUpdateBio() {
  const client = useQueryClient();
  const user = useSession();

  return useMutation({
    mutationFn: updateBio,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      client.invalidateQueries({ queryKey: userQueries.me().queryKey });
      client.invalidateQueries({ queryKey: profileQueries.byUsername(user.username).queryKey });
      toast.success('Biography updated successfully');
    },
  });
}
