import { cn } from '@/shared/lib/utils';

import type { LetterStatus } from '../lib/parse-diff';

type Props = {
  letter?: string;
  status?: LetterStatus | 'empty' | 'active';
};

export function WordleTile({ letter, status = 'empty' }: Props) {
  return (
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase transition-all duration-500',
        status === 'empty' && 'border-muted-foreground/30 text-foreground',
        status === 'active' && 'border-primary text-foreground scale-105',
        status === 'correct' && 'border-green-600 bg-green-600 text-white',
        status === 'present' && 'border-yellow-500 bg-yellow-500 text-white',
        status === 'absent' && 'bg-muted-foreground border-muted-foreground text-white',
      )}
    >
      {letter}
    </div>
  );
}
