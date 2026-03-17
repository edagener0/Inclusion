import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import z from 'zod';

import { ModalProvider } from '@/app/provider/ModalProvider';
import { Toaster } from '@/shared/ui/sonner';

interface RouterContext {
  queryClient: QueryClient;
}

const modalEnum = z.enum(['user-settings', 'create-content', 'create-post']);
const searchSchema = z.object({ modal: modalEnum.optional() });

export type ModalType = z.infer<typeof modalEnum>;

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: searchSchema,
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <ModalProvider />
      <TanStackRouterDevtools />
    </>
  ),
});
