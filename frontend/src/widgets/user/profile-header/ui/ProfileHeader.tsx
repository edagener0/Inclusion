import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { useSession } from '@/entities/session';
import { ProfileInfo, UserAvatar, profileQueries } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { CenterSpinner } from '@/shared/ui/spinner';

export function ProfileHeader({ username }: { username: string }) {
  const { data: profile, isLoading } = useQuery(profileQueries.byUsername(username));
  const user = useSession();
  const navigate = useNavigate();

  if (isLoading) return <CenterSpinner />;
  if (!profile) return null;

  return (
    <Card className="overflow-hidden border-none bg-zinc-900/50 backdrop-blur-md">
      <CardContent className="p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <div className="relative">
            <UserAvatar
              username={profile.username}
              avatar={profile.avatar}
              className="h-32 w-32 sm:h-40 sm:w-40 ring-4 ring-zinc-800 ring-offset-4 ring-offset-zinc-950"
            />
          </div>

          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
            <ProfileInfo
              firstName={profile.firstName}
              lastName={profile.lastName}
              biography={profile.biography}
            />

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2">
              {user.id === profile.id && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-none"
                  onClick={() => navigate({ to: '.', search: { modal: 'user-settings' } })}
                >
                  Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
