import { createFileRoute } from '@tanstack/react-router';

import { CenterSpinner } from '@/shared/ui/spinner';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const Route = createFileRoute('/_auth/sign-up')({
  pendingMs: 0,
  pendingMinMs: 500,
  loader: async () => {
    await sleep(2000);
  },
  pendingComponent: () => <CenterSpinner />,
});
