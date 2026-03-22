import { createRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';
import { queryClient } from '@/shared/api';

export const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
