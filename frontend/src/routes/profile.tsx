import { createFileRoute, redirect } from '@tanstack/react-router';

import { useUserStore } from '@/entities/user';

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const user = useUserStore.getState().user;
    if (!user) throw redirect({ to: '/sign-in' });

    throw redirect({ to: '/$username', params: { username: user!.username } });
  },
});
