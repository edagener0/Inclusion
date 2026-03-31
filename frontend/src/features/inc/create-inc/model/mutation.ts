import { useTranslation } from 'react-i18next';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { createInc, incQueries } from '@/entities/inc';

export function useCreateIncMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation('inc', { keyPrefix: 'create' });

  return useMutation({
    mutationFn: createInc,
    onSuccess: () => {
      toast.success(t('success'));
      navigate({ to: '.', search: { modal: undefined } });
      queryClient.invalidateQueries({ queryKey: incQueries.feed().queryKey });
    },
    onError: error => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
