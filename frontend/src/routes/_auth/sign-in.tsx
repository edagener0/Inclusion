import { createFileRoute } from '@tanstack/react-router';

import { SignInForm } from '@/features/auth/sign-in';

export const Route = createFileRoute('/_auth/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignInForm />;
}
