import { create } from 'zustand';

interface NotificationCountStore {
  total: () => number;

  main: number;
  incrementMain: (count: number) => void;

  friends: number;
  setFriends: (count: number) => void;
}

export const useNotificationCountStore = create<NotificationCountStore>((set, get) => ({
  main: 0,
  incrementMain: (count) => {
    set((prev) => ({ main: (prev.main += count) }));
  },

  friends: 0,
  setFriends: (count) => {
    set((prev) => ({ friends: (prev.friends = count) }));
  },

  total: () => get().friends + get().main,
}));
