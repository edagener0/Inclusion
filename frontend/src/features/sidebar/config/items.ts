import { Home, Mail, Settings, UserIcon } from 'lucide-react';

import type { NavItem } from '../model/types';

export const navItems: NavItem[] = [
  { icon: Home, label: 'Main', path: '/' },
  { icon: UserIcon, label: 'Profile', path: '/profile' },
  { icon: Mail, label: 'Messages', path: '/' },
  { icon: Settings, label: 'Settings', path: '/' },
];
