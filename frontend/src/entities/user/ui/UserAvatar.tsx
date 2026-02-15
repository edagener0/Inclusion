import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import { useUserStore } from '../model/store';

export function UserAvatar() {
  const user = useUserStore((s) => s.user)!;

  return (
    <Avatar className="h-9 w-9 border">
      <AvatarImage src={user.avatar} alt="@shadcn" />
      <AvatarFallback>{user.username}</AvatarFallback>
    </Avatar>
  );
}
