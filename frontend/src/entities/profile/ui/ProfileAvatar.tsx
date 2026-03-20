import { cn } from '@/shared/lib/utils/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import type { Profile } from '../model/types';

type ProfileAvatarSize = 'sm' | 'md' | 'lg' | '2xlg' | 'profile';

type ProfileAvatarProps = Pick<Profile, 'avatar' | 'username'> & {
  size?: ProfileAvatarSize;
  className?: string;
};

const sizeClasses: Record<ProfileAvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  '2xlg': 'h-20 w-20 md:h-28 md:w-28 mb-2 mt-2',
  profile: 'h-32 w-32 md:h-40 md:w-40',
};

export function ProfileAvatar({ username, avatar, size = 'md', className }: ProfileAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], 'border', className)}>
      <AvatarImage src={avatar} alt={username} />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
}
