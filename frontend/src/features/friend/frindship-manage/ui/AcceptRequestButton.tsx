import { useTranslation } from 'react-i18next';

import { Check } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import { useAcceptRequestMutation } from '../model/accept-mutation';

type Props = {
  userId: number;
  username: string;
};

export function AcceptRequestButton({ userId, username }: Props) {
  const mutation = useAcceptRequestMutation();
  const { t } = useTranslation('friend', { keyPrefix: 'request.accept' });

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={t('button')}
      title={t('button')}
      className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
      onClick={() => mutation.mutate({ username, userId })}
    >
      <Check className="h-4 w-4" />
    </Button>
  );
}
