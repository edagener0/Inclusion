import { createLazyFileRoute } from '@tanstack/react-router';

import { SignInForm } from '@/features/auth/sign-in';

export const Route = createLazyFileRoute('/_auth/sign-in')({
  component: RouteComponent,
});

export function RouteComponent() {
  return <SignInForm />;
}
