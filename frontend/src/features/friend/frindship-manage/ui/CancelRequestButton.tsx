import { useTranslation } from 'react-i18next';

import { CircleX } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import { useCancelRequestMutation } from '../model/cancel-mutation';

type Props = {
  userId: number;
};

export function CancelRequestButton({ userId }: Props) {
  const mutation = useCancelRequestMutation();
  const { t } = useTranslation('friend', { keyPrefix: 'request.cancel' });

  return (
    <Button
      variant="outline"
      aria-label={t('button')}
      title={t('button')}
      onClick={() => mutation.mutate(userId)}
    >
      <CircleX className="h-4 w-4" />
    </Button>
  );
}
