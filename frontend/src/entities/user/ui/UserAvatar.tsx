import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

type UserAvatarSize = 'sm' | 'md' | 'lg' | 'profile';

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  profile: 'h-32 w-32 md:h-40 md:w-40',
};

export function UserAvatar({
  size = 'md',
  url,
  username,
}: {
  size?: UserAvatarSize;
  url: string;
  username: string;
}) {
  return (
    <Avatar className={cn(sizeClasses[size], 'h-9 w-9 border')}>
      <AvatarImage src={url} alt={username} />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
}
