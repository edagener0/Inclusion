import { Outlet, createFileRoute } from '@tanstack/react-router';

import { IncList } from '@/widgets/inc-list';

export const Route = createFileRoute('/_main/incs')({
  component: function () {
    return (
      <div className="relative">
        <IncList />
        <Outlet />
      </div>
    );
  },
});
