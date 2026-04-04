import { useTranslation } from 'react-i18next';

import { UserPlus } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import { useSendRequestMutation } from '../model/send-mutation';

type Props = {
  userId: number;
};

export function SendRequestButton({ userId }: Props) {
  const mutation = useSendRequestMutation();
  const { t } = useTranslation('friend', { keyPrefix: 'request.send' });

  return (
    <Button
      variant="outline"
      aria-label={t('button')}
      title={t('button')}
      onClick={() => mutation.mutate(userId)}
    >
      <UserPlus className="h-4 w-4" />
      {t('button')}
    </Button>
  );
}
