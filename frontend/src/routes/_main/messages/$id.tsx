import { createFileRoute } from '@tanstack/react-router';

import { CenterSpinner } from '@/shared/ui/spinner';

export const Route = createFileRoute('/_main/messages/$id')({
  pendingComponent: () => <CenterSpinner />,
});
