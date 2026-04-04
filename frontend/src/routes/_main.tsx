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
      <div className="bg-background text-foreground flex min-h-screen w-full flex-col">
        <Header
          sideBarSlot={<SidebarNav mobile />}
          userMenuSlot={<UserDropDownMenu />}
          notificationSlot={<NotificationWidget />}
        />

        <div className="mx-auto flex w-full items-start justify-center gap-x-8 px-4">
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-50 shrink-0 flex-col border-r py-6 pr-4 md:flex">
            <SidebarNav />

            <div className="mt-auto border-t pt-4">
              <p className="text-muted-foreground text-xs">
                © {new Date().getFullYear()} {APP_NAME}
              </p>
            </div>
          </aside>

          <main className="w-full max-w-2xl py-6">
            <Outlet />
          </main>
        </div>

        <TanStackRouterDevtools />
      </div>
    );
  },
});
