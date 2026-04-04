import { useTranslation } from 'react-i18next';

import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import { useDeclineRequestMutation } from '../model/decline-mutation';

type Props = {
  userId: number;
};

export function DeclineRequestButton({ userId }: Props) {
  const mutation = useDeclineRequestMutation();
  const { t } = useTranslation('friend', { keyPrefix: 'request.decline' });

  return (
    <Button
      variant="destructive"
      size="icon"
      aria-label={t('button')}
      title={t('button')}
      onClick={() => mutation.mutate(userId)}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
