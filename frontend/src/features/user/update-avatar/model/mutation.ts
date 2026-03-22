import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sessionQueries, useSession } from '@/entities/session';
import { profileQueries } from '@/entities/user';

import { updateAvatar } from '../api/request';

export function useUpdateAvatar() {
  const client = useQueryClient();
  const user = useSession();

  return useMutation({
    mutationFn: (file: File) => updateAvatar(file),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      client.invalidateQueries({ queryKey: profileQueries.byUsername(user.username).queryKey });
      toast('Avatar updated succesefully');
    },
  });
}
