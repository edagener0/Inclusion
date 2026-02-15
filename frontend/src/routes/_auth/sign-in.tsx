import { createFileRoute } from '@tanstack/react-router';

import type { CenterSpinner } from '@/shared/ui/spinner';

export const Route = createFileRoute('/_auth/sign-in')({
  pendingComponent: () => <CenterSpinner />,
});
