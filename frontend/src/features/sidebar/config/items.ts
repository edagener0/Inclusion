import { Home, Mail, PlusIcon, Settings, UserIcon } from 'lucide-react';

import type { NavItem } from '../model/types';

export const navItems: NavItem[] = [
  { icon: Home, label: 'Main', path: '/' },
  { icon: UserIcon, label: 'Profile', path: '/profile' },
  { icon: Mail, label: 'Messages', path: '/messages' },
  { icon: Settings, label: 'Settings', path: '/' },
  { icon: Mail, label: 'Messages', path: '/' },
  { icon: Settings, label: 'Settings', modal: 'user-settings' },
  { icon: PlusIcon, label: 'New Content', modal: 'create-content' },
];
