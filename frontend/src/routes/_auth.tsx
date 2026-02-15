import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

import { SignInIcon } from '@/features/auth/sign-in';
import { SignUpIcon } from '@/features/auth/sign-up';
import { AppLogo } from '@/shared/assets/icons/AppIcon';
import { APP_NAME } from '@/shared/config';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const location = useLocation();
  const isSignUp = location.pathname.includes('sign-up');

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-1 font-bold text-lg">
            <AppLogo className="h-14 w-14" />
            {APP_NAME}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="bg-muted hidden lg:flex items-center justify-center">
        {isSignUp ? <SignUpIcon /> : <SignInIcon />}
      </div>
    </div>
  );
}
