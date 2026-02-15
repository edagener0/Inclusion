import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import { useCurrentUser } from '../model/store';

export function UserAvatar() {
  const user = useCurrentUser();

  return (
    <Avatar className="h-9 w-9 border">
      <AvatarImage src={user.avatar} alt="@shadcn" />
      <AvatarFallback>{user.username}</AvatarFallback>
    </Avatar>
  );
}
