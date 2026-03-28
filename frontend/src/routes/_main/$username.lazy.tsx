import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';

import { profileQueries } from '@/entities/user';
import { CenterSpinner } from '@/shared/ui/spinner';
import { ProfileHeader } from '@/widgets/user/profile-header';

export const Route = createLazyFileRoute('/_main/$username')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user, isLoading } = useQuery(profileQueries.byUsername(username));
  const { t } = useTranslation('user');

  if (isLoading) return <CenterSpinner />;
  if (!user) return <>{t('notFound')}</>;

  return (
    <>
      <ProfileHeader username={username} />
    </>
  );
}
