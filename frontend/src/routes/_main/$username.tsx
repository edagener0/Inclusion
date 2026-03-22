import { createFileRoute } from '@tanstack/react-router';

import { CenterSpinner } from '@/shared/ui/spinner';

export const Route = createFileRoute('/_main/$username')({
  pendingComponent: () => <CenterSpinner />,
});
