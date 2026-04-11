import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, notFound } from '@tanstack/react-router';

import { FriendList } from '@/widgets/friend-list';
import { IncList } from '@/widgets/inc-list';
import { PostList } from '@/widgets/post-list';
import { ProfileContent } from '@/widgets/user/profile-content';
import { ProfileHeader } from '@/widgets/user/profile-header';

import { friendQueries } from '@/entities/friend';
import { incQueries } from '@/entities/inc';
import { postQueries } from '@/entities/post';
import { profileQueries } from '@/entities/user';

import { CenterSpinner } from '@/shared/ui/spinner';

export const Route = createLazyFileRoute('/_main/$username')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user, isLoading } = useQuery(profileQueries.byUsername(username));

  if (isLoading) return <CenterSpinner />;
  if (!user) throw notFound();

  return (
    <div className="pr-1 pl-1">
      <ProfileHeader username={username} />
      <ProfileContent
        incsSlot={<IncList queryOptions={incQueries.byUsername(username)} />}
        postsSlot={<PostList queryOptions={postQueries.byUsername(username)} />}
        friendsSlot={<FriendList queryOptions={friendQueries.friendsByUsername(username)} />}
      />
    </div>
  );
}
