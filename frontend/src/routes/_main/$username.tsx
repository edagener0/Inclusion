import { createFileRoute } from '@tanstack/react-router';

import { ProfileHeader } from '@/widgets/profile-header';

export const Route = createFileRoute('/_main/$username')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  return <ProfileHeader username={username} />;
}
