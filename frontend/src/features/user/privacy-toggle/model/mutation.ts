import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sessionQueries, useSession } from '@/entities/session';
import { profileQueries, userQueries } from '@/entities/user';

import { updateAccountPrivacy } from '../api/requests';

export function useUpdateAccountPrivacy() {
  const client = useQueryClient();
  const user = useSession();

  return useMutation({
    mutationFn: updateAccountPrivacy,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      client.invalidateQueries({ queryKey: userQueries.me().queryKey });
      client.invalidateQueries({ queryKey: profileQueries.byUsername(user.username).queryKey });
      toast.success('Account privacy updated succesefully');
    },
  });
}
