import { useQuery } from '@tanstack/react-query';

import { userQueries } from '@/entities/user';
import { UserPrivacyToggle } from '@/features/user/privacy-toggle';
import { UpdateUserAvatarCard } from '@/features/user/update-avatar';
import { UpdateUserBioCard } from '@/features/user/update-bio';
import { UpdateUserFullNameCard } from '@/features/user/update-full-name';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';
import { CenterSpinner } from '@/shared/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function UserSettingsModal() {
  const { data: user, isLoading } = useQuery(userQueries.me());

  if (isLoading) return <CenterSpinner />;
  if (!user) throw new Error('unreachable');

  return (
    <RoutedDialog>
      <DialogContent className="sm:max-w-175 h-[85vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle>Account settings</DialogTitle>
            <DialogDescription>
              Manage your account, security, and other information.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="general" className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="personal-information"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                Personal Information
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <TabsContent value="general" className="mt-0 flex flex-col gap-6">
              <UpdateUserAvatarCard username={user.username} currentAvatar={user.avatar} />
              <UserPrivacyToggle isPrivate={user.isPrivate} />
            </TabsContent>

            <TabsContent value="personal-information" className="mt-0 flex flex-col gap-6">
              <UpdateUserFullNameCard firstName={user.firstName} lastName={user.lastName} />
              <UpdateUserBioCard biography={user.biography} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </RoutedDialog>
  );
}
