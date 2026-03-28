import { createFileRoute } from '@tanstack/react-router';

import { loadNamespace } from '@/shared/config';
import { CenterSpinner } from '@/shared/ui/spinner';

export const Route = createFileRoute('/_main/stories/$id')({
  pendingComponent: () => <CenterSpinner />,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || '/incs',
    };
  },
  loader: async () => {
    await loadNamespace(['story', 'message']);
  },
});
