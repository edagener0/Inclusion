import { Outlet, createFileRoute } from '@tanstack/react-router';

import { IncList } from '@/widgets/inc-list';
import { StoriesSection } from '@/widgets/stories/stories-section';

export const Route = createFileRoute('/_main/incs')({
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
