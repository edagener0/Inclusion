import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, notFound } from '@tanstack/react-router';

import { profileQueries } from '@/entities/user';
import { CenterSpinner } from '@/shared/ui/spinner';
import { ProfileHeader } from '@/widgets/user/profile-header';

export const Route = createLazyFileRoute('/_main/$username')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user, isLoading } = useQuery(profileQueries.byUsername(username));

  if (isLoading) return <CenterSpinner />;
  if (!user) throw notFound();

  return (
    <>
      <ProfileHeader username={username} />
    </>
  );
}
