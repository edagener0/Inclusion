import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';

import { UserPrivacyToggle } from '@/features/user/privacy-toggle';
import { UpdateUserAvatarCard } from '@/features/user/update-avatar';
import { UpdateUserBioCard } from '@/features/user/update-bio';
import { UpdateUserFullNameCard } from '@/features/user/update-full-name';

import { userQueries } from '@/entities/user';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { RoutedDialog } from '@/shared/ui/routed-dialog';
import { CenterSpinner } from '@/shared/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function UserSettingsModal() {
  const { data: user, isLoading } = useQuery(userQueries.me());
  const { t } = useTranslation('user', { keyPrefix: 'settings' });

  if (isLoading) return <CenterSpinner />;
  if (!user) throw new Error('unreachable');

  return (
    <RoutedDialog>
      <DialogContent className="flex h-[85vh] flex-col p-0 sm:max-w-175">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="general" className="flex flex-1 flex-col overflow-hidden">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                {t('general')}
              </TabsTrigger>
              <TabsTrigger
                value="personal-information"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                {t('personal')}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <TabsContent value="general" className="mt-0 flex flex-col gap-6">
              <UpdateUserAvatarCard avatar={user.avatar} />
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
