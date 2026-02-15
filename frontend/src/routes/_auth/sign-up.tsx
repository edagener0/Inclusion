import { createFileRoute } from '@tanstack/react-router';

import { SignUpForm } from '@/features/auth/sign-up';

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpForm />;
}
