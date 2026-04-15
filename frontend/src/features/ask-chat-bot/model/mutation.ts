import { useTranslation } from 'react-i18next';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useChatBotStore } from '@/entities/chat-bot';

import { askBot } from '../api/requests';
import type { AskChatBot } from './schema';

export function useAskChatBotMutation() {
  const { t } = useTranslation('chat-bot', { keyPrefix: 'ask' });
  const addMessage = useChatBotStore((state) => state.addMessage);
  const removeMessage = useChatBotStore((state) => state.removeMessage);
  const setIsThinking = useChatBotStore((s) => s.setIsThinking);

  return useMutation({
    mutationFn: askBot,
    onMutate: async ({ prompt }: AskChatBot) => {
      const date = new Date();
      const id = date.getTime();

      addMessage({ id, isBot: false, message: prompt, createdAt: date });
      setIsThinking(true);

      return { id };
    },
    onSuccess: ({ response }) => {
      addMessage({ id: Date.now(), message: response, isBot: true, createdAt: new Date() });
      toast.success(t('success'));
      setIsThinking(false);
    },
    onError: (error, _, context) => {
      console.error(error);

      if (context?.id) removeMessage(context.id);
      setIsThinking(false);

      toast.error(t('error'));
    },
  });
}
