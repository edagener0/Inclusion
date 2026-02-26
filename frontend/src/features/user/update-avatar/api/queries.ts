import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileQueryKeys } from '@/entities/profile';
import { sessionQueryKey, useStrictSession } from '@/entities/session';

import { updateAvatar } from './request';

export function useUpdateAvatar() {
  const client = useQueryClient();
  const user = useStrictSession();

  return useMutation({
    mutationFn: (file: File) => updateAvatar(file),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: sessionQueryKey });
      client.invalidateQueries({ queryKey: profileQueryKeys.byUsername(user.username) });
      toast('Avatar updated succesefully');
    },
  });
}
