import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext, isRedirect, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { sessionQueryOptions } from '@/features/auth/session';
import { IS_AUTH_MAKRER } from '@/shared/config';

interface RouterContext {
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context, location }) => {
    const publicPaths = ['/sign-in', '/sign-up'];
    const isPublic = publicPaths.some((path) => location.pathname.startsWith(path));

    const hasAuthMarker = localStorage.getItem(IS_AUTH_MAKRER) === 'true';
    if (isPublic && !hasAuthMarker) return;

    try {
      await context.queryClient.ensureQueryData(sessionQueryOptions);

      if (isPublic) throw redirect({ to: '/' });
    } catch (err: unknown) {
      if (isRedirect(err)) {
        throw err;
      }

      if (!isPublic) {
        throw redirect({ to: '/sign-in' });
      }
    }
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Header */}

      <main className="@container/main flex flex-1 flex-col gap-2">
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </div>
  );
}
