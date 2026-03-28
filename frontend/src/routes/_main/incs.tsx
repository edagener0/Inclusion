import { Outlet, createFileRoute } from '@tanstack/react-router';

import { loadNamespace } from '@/shared/config';
import { IncList } from '@/widgets/inc-list';
import { StoriesSection } from '@/widgets/stories/stories-section';

export const Route = createFileRoute('/_main/incs')({
  loader: async () => {
    await loadNamespace(['inc', 'message']);
  },
  component: function () {
    return (
      <div className="relative">
        <div className="pb-2">
          <StoriesSection />
        </div>
        <IncList />
        <Outlet />
      </div>
    );
  },
});
