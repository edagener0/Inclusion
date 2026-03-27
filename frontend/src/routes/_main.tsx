import { Outlet, createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { sessionQueries } from '@/entities/session';
import { APP_NAME, IS_AUTH_MARKER } from '@/shared/config/constants';
import { Header } from '@/widgets/header';
import { SidebarNav } from '@/widgets/sidebar';
import { UserDropDownMenu } from '@/widgets/user/user-menu';

export const Route = createFileRoute('/_main')({
  beforeLoad: async ({ context, location }) => {
    const publicPaths = ['/sign-in', '/sign-up'];
    const isPublic = publicPaths.some(path => location.pathname.startsWith(path));

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
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <Header sideBarSlot={<SidebarNav mobile />} userMenuSlot={<UserDropDownMenu />} />

        <div className="mx-auto flex justify-center gap-x-8 items-start px-4 w-full">
          <aside className="hidden md:flex flex-col w-50 shrink-0 sticky top-16 h-[calc(100vh-4rem)] py-6 border-r pr-4">
            <SidebarNav />

            <div className="mt-auto border-t pt-4">
              <p className="text-xs text-muted-foreground">
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
