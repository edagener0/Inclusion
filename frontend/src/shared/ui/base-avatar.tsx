import { type ReactNode } from 'react';

import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
};

export function BaseAvatar({ src, alt, className, children }: Props) {
  return (
    <Avatar className={cn('border', className)}>
      <AvatarImage src={src} alt={alt} />
      {alt && <AvatarFallback>{alt.slice(0, 2).toUpperCase()}</AvatarFallback>}

      {children}
    </Avatar>
  );
}
