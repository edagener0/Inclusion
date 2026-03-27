import { type ReactNode } from 'react';

import { create } from 'zustand';

interface ConfirmModalConfig {
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  isDestructive?: boolean;
}

interface ConfirmModalStore {
  isOpen: boolean;
  config: ConfirmModalConfig | null;
  isLoading: boolean;
  openConfirm: (config: ConfirmModalConfig) => void;
  closeConfirm: () => void;
  setLoading: (loading: boolean) => void;
}

export const useConfirmModal = create<ConfirmModalStore>(set => ({
  isOpen: false,
  config: null,
  isLoading: false,
  openConfirm: config => set({ isOpen: true, config, isLoading: false }),
  closeConfirm: () => set({ isOpen: false, config: null }),
  setLoading: loading => set({ isLoading: loading }),
}));
