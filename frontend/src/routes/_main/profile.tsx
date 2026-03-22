import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';

import { sessionQueries } from '@/entities/session';

export const Route = createFileRoute('/_main/profile')({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.fetchQuery(sessionQueries.me());

      if (!user) {
        throw redirect({ to: '/sign-in' });
      }

      throw redirect({
        to: '/$username',
        params: { username: user.username },
      });
    } catch (error) {
      if (isRedirect(error)) throw error;

      throw redirect({ to: '/sign-in' });
    }
  },
});
