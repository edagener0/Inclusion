import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { createConversation } from '../api/requests';

export function useCreateConversationMutation() {
  const navigate = useNavigate();
  const { t } = useTranslation('message', { keyPrefix: 'first' });

  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      navigate({ to: '/' });
      toast.success(t('success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('error'));
    },
  });
}
