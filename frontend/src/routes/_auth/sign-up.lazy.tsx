import { createLazyFileRoute } from '@tanstack/react-router';

import { SignUpForm } from '@/features/auth/sign-up';

export const Route = createLazyFileRoute('/_auth/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpForm />;
}
