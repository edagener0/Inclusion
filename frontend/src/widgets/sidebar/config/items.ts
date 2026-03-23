import { ImagesIcon, Mail, PlusIcon, ScrollTextIcon, Settings, UserIcon } from 'lucide-react';

import type { NavItem } from '../model/types';

export const navItems: NavItem[] = [
  { icon: ScrollTextIcon, label: 'Incs', path: '/incs' },
  { icon: ImagesIcon, label: 'Posts', path: '/posts' },
  { icon: UserIcon, label: 'Profile', path: '/profile' },
  { icon: Mail, label: 'Messages', path: '/messages' },
  { icon: Settings, label: 'Settings', modal: 'user-settings' },
  { icon: PlusIcon, label: 'New Content', modal: 'create-content' },
];
