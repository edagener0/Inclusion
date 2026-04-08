import { useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { FriendshipManageButton } from '@/features/friend/frindship-manage';

import { useSession } from '@/entities/session';
import { ProfileInfo, UserAvatar, profileQueries } from '@/entities/user';

import { Card, CardContent } from '@/shared/ui/card';
import { CenterSpinner } from '@/shared/ui/spinner';

export function ProfileHeader({ username }: { username: string }) {
  const session = useSession();

  const { data: profile, isLoading } = useQuery(profileQueries.byUsername(username));
  if (isLoading) return <CenterSpinner />;
  if (!profile) throw notFound();

  return (
    <Card className="overflow-hidden border-none bg-zinc-100/50 backdrop-blur-md dark:bg-zinc-900/50">
      <CardContent className="p-5 sm:p-7">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <div className="relative">
            <UserAvatar
              username={profile.username}
              avatar={profile.avatar}
              className="h-24 w-24 ring-2 ring-white ring-offset-2 ring-offset-zinc-50 sm:h-28 sm:w-28 dark:ring-zinc-800 dark:ring-offset-zinc-950"
            />
          </div>

          <div className="flex flex-1 flex-col items-center space-y-1.5 text-center sm:items-start sm:text-left">
            <ProfileInfo
              firstName={profile.firstName}
              lastName={profile.lastName}
              biography={profile.biography}
            />

            <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
              {session.id !== profile.id && (
                <FriendshipManageButton
                  isFriend={profile.isFriend}
                  userId={profile.id}
                  username={profile.username}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
