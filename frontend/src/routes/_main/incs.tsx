import { Outlet, createFileRoute } from '@tanstack/react-router';

import { IncList } from '@/widgets/inc-list';
import { StoriesSection } from '@/widgets/stories/stories-section';

import { incQueries } from '@/entities/inc';

import { loadNamespace } from '@/shared/config';

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
        <IncList queryOptions={incQueries.feed()} />
        <Outlet />
      </div>
    );
  },
});
