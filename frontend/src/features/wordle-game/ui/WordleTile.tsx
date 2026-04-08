import { cn } from '@/shared/lib/utils';

import { type WordleTileProps } from '../model/hook';

export function WordleTile({ letter, status = 'empty' }: WordleTileProps) {
  return (
    <div
      className={cn(
        'w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-all duration-500',
        // Estados de cor
        status === 'empty' && 'border-muted-foreground/30 text-foreground',
        status === 'active' && 'border-primary text-foreground scale-105',
        status === 'correct' && 'bg-green-600 border-green-600 text-white',
        status === 'present' && 'bg-yellow-500 border-yellow-500 text-white',
        status === 'absent' && 'bg-muted-foreground border-muted-foreground text-white',
      )}
    >
      {letter}
    </div>
  );
}
