import { Outlet, createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Header } from '@/widgets/header';
import { NotificationWidget } from '@/widgets/notification';
import { SidebarNav } from '@/widgets/sidebar';
import { UserDropDownMenu } from '@/widgets/user/user-menu';

import { sessionQueries } from '@/entities/session';

import { APP_NAME, IS_AUTH_MARKER } from '@/shared/config';

export const Route = createFileRoute('/_main')({
  beforeLoad: async ({ context, location }) => {
    const publicPaths = ['/sign-in', '/sign-up'];
    const isPublic = publicPaths.some((path) => location.pathname.startsWith(path));

    const hasAuthMarker = localStorage.getItem(IS_AUTH_MARKER) === 'true';
    if (isPublic && !hasAuthMarker) return;

    try {
      await context.queryClient.fetchQuery(sessionQueries.me());

      if (isPublic) throw redirect({ to: '/' });
    } catch (err: unknown) {
      if (isRedirect(err)) throw err;
      if (!isPublic) throw redirect({ to: '/sign-in' });
    }
  },
  component: function () {
    return (
      <div className="bg-background text-foreground flex h-dvh w-full flex-col overflow-hidden">
        <Header
          sideBarSlot={<SidebarNav mobile />}
          userMenuSlot={<UserDropDownMenu />}
          notificationSlot={<NotificationWidget />}
        />

        <div className="mx-auto flex min-h-0 w-full flex-1 items-start justify-center gap-x-8 px-4">
          <aside className="hidden h-full w-50 shrink-0 flex-col overflow-y-auto border-r py-6 pr-4 md:flex">
            <SidebarNav />

            <div className="mt-auto border-t pt-4">
              <p className="text-muted-foreground text-xs">
                © {new Date().getFullYear()} {APP_NAME}
              </p>
            </div>
          </aside>

          <main className="flex h-full w-full max-w-2xl flex-col overflow-y-auto py-6">
            <Outlet />
          </main>
        </div>

        <TanStackRouterDevtools />
      </div>
    );
  },
});
