import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/utils';

interface Props {
  username: string;
  className?: string;
}

export function LinkedUsername({ username, className }: Props) {
  return (
    <Link
      to="/$username"
      params={{ username: username }}
      className={cn('font-medium transition-colors hover:underline', className)}
    >
      {username}
    </Link>
  );
}
