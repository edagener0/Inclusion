import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sessionQueries, useSession } from '@/entities/session';
import { profileQueries, userQueries } from '@/entities/user';

import { updateFullName } from '../api/requests';

export function useUpdateFullName() {
  const client = useQueryClient();
  const user = useSession();

  return useMutation({
    mutationFn: updateFullName,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      client.invalidateQueries({ queryKey: userQueries.me().queryKey });
      client.invalidateQueries({ queryKey: profileQueries.byUsername(user.username).queryKey });
      toast('Full name updated successfully');
    },
  });
}
