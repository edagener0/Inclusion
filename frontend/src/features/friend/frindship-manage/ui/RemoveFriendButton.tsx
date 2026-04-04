import { useTranslation } from 'react-i18next';

import { UserMinus } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import { useRemoveFriendMutation } from '../model/remove-mutation';

type Props = {
  userId: number;
  username: string;
};

export function RemoveFriendButton({ userId, username }: Props) {
  const mutation = useRemoveFriendMutation();
  const { t } = useTranslation('friend', { keyPrefix: 'request.remove' });

  return (
    <Button
      variant="outline"
      aria-label={t('button')}
      title={t('button')}
      onClick={() => mutation.mutate({ username, userId })}
    >
      {t('button')}
      <UserMinus className="h-4 w-4" />
    </Button>
  );
}
