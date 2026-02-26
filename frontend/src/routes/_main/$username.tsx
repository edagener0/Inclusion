import { createFileRoute } from '@tanstack/react-router';

import { useGetProfileByUsername } from '@/entities/profile';
import { CenterSpinner } from '@/shared/ui/spinner';
import { ProfileHeader } from '@/widgets/profile-header';

export const Route = createFileRoute('/_main/$username')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user, isLoading } = useGetProfileByUsername(username);

  if (isLoading) return <CenterSpinner />;
  if (!user) return <>User not found</>;

  return (
    <>
      <ProfileHeader username={username} />
    </>
  );
}
