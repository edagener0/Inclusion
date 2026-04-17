/* eslint-disable react-refresh/only-export-components */
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main/games')({
  component: Games,
});

function Games() {
  return (
    <div className="relative">
      <Outlet />
    </div>
  );
}
