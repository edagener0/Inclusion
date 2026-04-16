import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type ChatBotMessage, ChatBotMessageSchema } from './schema';

type ChatBotStore = {
  messages: ChatBotMessage[];
  isBotThinking: boolean;
  setIsThinking: (isThinking: boolean) => void;
  addMessage: (message: ChatBotMessage) => void;
  removeMessage: (id: ChatBotMessage['id']) => void;
  clearOld: () => void;
  clearAll: () => void;
};

const MS_IN_24_HOURS = 24 * 60 * 60 * 1000;

export const useChatBotStore = create<ChatBotStore>()(
  persist(
    (set) => ({
      isBotThinking: false,
      setIsThinking: (isThinking) => set({ isBotThinking: isThinking }),

      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      removeMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        })),
      clearOld: () => {
        const now = Date.now();
        set((state) => ({
          messages: state.messages.filter((msg) => {
            const msgDate = new Date(msg.createdAt).getTime();
            return now - msgDate < MS_IN_24_HOURS;
          }),
        }));
      },
      clearAll: () => {
        set({ messages: [] });
      },
    }),
    {
      name: 'chatbot-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ messages: state.messages }),
      merge: (persistedState, currentState) => {
        const pState = persistedState as { messages?: unknown };

        if (!pState || !Array.isArray(pState.messages)) return currentState;

        const validatedMessages = pState.messages.filter((msg) => {
          const result = ChatBotMessageSchema.safeParse(msg);
          if (!result.success) {
            console.warn('Invalid message found and removed from storage:', msg);
          }
          return result.success;
        });

        return {
          ...currentState,
          messages: validatedMessages,
        };
      },
    },
  ),
);
