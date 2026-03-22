import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import type { User } from '../model/types';

type Props = Pick<User, 'avatar' | 'username'> & {
  className?: string;
};

export function UserAvatar({ username, avatar, className }: Props) {
  return (
    <Avatar className={cn('border', className)}>
      <AvatarImage src={avatar} alt={username} />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
}
