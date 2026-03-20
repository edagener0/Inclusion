import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { profileQueries } from '@/entities/profile';
import { CenterSpinner } from '@/shared/ui/spinner';
import { ProfileHeader } from '@/widgets/profile-header';

export const Route = createFileRoute('/_main/$username')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user, isLoading } = useQuery(profileQueries.byUsername(username));

  if (isLoading) return <CenterSpinner />;
  if (!user) return <>User not found</>;

  return (
    <>
      <ProfileHeader username={username} />
    </>
  );
}
