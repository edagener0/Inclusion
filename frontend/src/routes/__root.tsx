import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import z from 'zod';

import { ConfirmModalProvider } from '@/app/provider/ConfirmModalProvider';
import { ModalProvider } from '@/app/provider/ModalProvider';

import { NotFoundWidget } from '@/widgets/not-found';

import '@/shared/config/i18n';
import { loadNamespace } from '@/shared/config/i18n';
import { Toaster } from '@/shared/ui/sonner';

interface RouterContext {
  queryClient: QueryClient;
}

const modalEnum = z.enum([
  'user-settings',
  'create-content',
  'create-post',
  'create-inc',
  'create-story',
]);
const SearchSchema = z.object({ modal: modalEnum.optional() });

export type ModalType = z.infer<typeof modalEnum>;

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: SearchSchema,
  notFoundComponent: () => <NotFoundWidget />,
  loader: async () => {
    await loadNamespace(['common']);
  },
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <ConfirmModalProvider />
      <ModalProvider />
      <TanStackRouterDevtools />
    </>
  ),
});
