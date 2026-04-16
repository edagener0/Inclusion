import { Link } from '@tanstack/react-router';

import type { UserPreview } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import { BaseAvatar } from '@/shared/ui/base-avatar';

interface Props {
  user: UserPreview;
  className?: string;
}

export function UserSnippet({ user, className }: Props) {
  return (
    <Link
      to="/$username"
      params={{ username: user.username.toString() }}
      className={cn('group flex items-center gap-3', className)}
    >
      <BaseAvatar src={user.avatar} alt={user.username} />
      <span className="text-foreground truncate text-[15px] font-bold group-hover:underline hover:underline">
        {user.username}
      </span>
    </Link>
  );
}
