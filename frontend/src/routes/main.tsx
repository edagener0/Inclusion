import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/main')({ component: Index });

function Index() {
  return <div className="max-w-2xl mx-auto space-y-6">Info</div>;
}
