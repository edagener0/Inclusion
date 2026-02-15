import { create } from 'zustand';

import type { User } from './types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
}));

export const useCurrentUser = () => {
  const user = useUserStore(s => s.user);

  if (!user) {
    throw new Error('useCurrentUser must be used within an authenticated route');
  }

  return user;
};
