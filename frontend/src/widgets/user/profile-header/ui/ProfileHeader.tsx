import { useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { useSession } from '@/entities/session';
import { ProfileInfo, UserAvatar, profileQueries } from '@/entities/user';
import { FriendshipManageButton } from '@/features/friend/frindship-manage';
import { Card, CardContent } from '@/shared/ui/card';
import { CenterSpinner } from '@/shared/ui/spinner';

export function ProfileHeader({ username }: { username: string }) {
  const session = useSession();

  const { data: profile, isLoading } = useQuery(profileQueries.byUsername(username));
  if (isLoading) return <CenterSpinner />;
  if (!profile) throw notFound();

  return (
    <Card className="overflow-hidden border-none bg-zinc-100/50 dark:bg-zinc-900/50 backdrop-blur-md">
      <CardContent className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center">
          <div className="relative">
            <UserAvatar
              username={profile.username}
              avatar={profile.avatar}
              className="h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-white dark:ring-zinc-800 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950"
            />
          </div>

          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5">
            <ProfileInfo
              firstName={profile.firstName}
              lastName={profile.lastName}
              biography={profile.biography}
            />

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              {session.id !== profile.id && <FriendshipManageButton profile={profile} />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
