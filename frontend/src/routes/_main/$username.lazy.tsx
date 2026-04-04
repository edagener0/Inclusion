import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, notFound } from '@tanstack/react-router';

import { postQueries } from '@/entities/post';
import { profileQueries } from '@/entities/user';
import { CenterSpinner } from '@/shared/ui/spinner';
import { PostList } from '@/widgets/post-list';
import { ProfileContent } from '@/widgets/user/profile-content';
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
      <ProfileContent postsSlot=<PostList queryOptions={postQueries.byUsername(username)} /> />
    </>
  );
}
