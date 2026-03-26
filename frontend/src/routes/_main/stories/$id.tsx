import { createFileRoute } from '@tanstack/react-router';

import { CenterSpinner } from '@/shared/ui/spinner';

export const Route = createFileRoute('/_main/stories/$id')({
  pendingComponent: () => <CenterSpinner />,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || '/incs',
    };
  },
});
