import { useNavigate } from '@tanstack/react-router';

import { ProfileAvatar, ProfileInfo, useGetProfileByUsername } from '@/entities/profile';
import { useStrictSession } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { CenterSpinner } from '@/shared/ui/spinner';

export function ProfileHeader({ username }: { username: string }) {
  const { data: profile, isLoading } = useGetProfileByUsername(username);
  const user = useStrictSession();
  const navigate = useNavigate();

  if (isLoading) return <CenterSpinner />;
  if (!profile) return null;

  return (
    <Card>
      <CardContent className="pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <ProfileAvatar size="profile" username={profile.username} avatar={profile.avatar} />

          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <ProfileInfo
              firstName={profile.firstName}
              lastName={profile.lastName}
              biography={profile.biography}
            />

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              {user.id === profile.id && (
                <Button
                  variant="outline"
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
