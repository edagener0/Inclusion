import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { type WordleKeyProps } from '../../../features/wordle-game/model/types';

export function WordleKey({ value, status = 'unused', onClick, disabled }: WordleKeyProps) {
  const isSpecialKey = value.length > 1;

  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={() => onClick(value)}
      className={cn(
        'h-14 font-bold uppercase transition-colors',
        isSpecialKey ? 'px-4 text-xs' : 'w-10 text-sm',
        // Cores do teclado baseadas no progresso do jogo
        status === 'unused' && 'bg-background',
        status === 'correct' &&
          'border-green-600 bg-green-600 text-white hover:bg-green-700 hover:text-white',
        status === 'present' &&
          'border-yellow-500 bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white',
        status === 'absent' && 'bg-muted-foreground/50 text-muted-foreground border-transparent',
      )}
    >
      {value}
    </Button>
  );
}
