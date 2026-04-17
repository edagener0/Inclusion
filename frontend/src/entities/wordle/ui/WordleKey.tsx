import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import type { LetterStatus } from '../lib/parse-diff';

type WordleKeyProps = {
  value: string;
  status?: LetterStatus | 'unused';
  onClick: (key: string) => void;
  disabled?: boolean;
};

export function WordleKey({ value, status = 'unused', onClick, disabled }: WordleKeyProps) {
  const isSpecialKey = value.length > 1;
  console.log(value, status);

  const buttonVariant = status === 'unused' ? 'outline' : 'default';

  return (
    <Button
      variant={buttonVariant}
      disabled={disabled}
      onClick={() => onClick(value)}
      className={cn(
        'h-14 font-bold uppercase transition-colors',
        isSpecialKey ? 'px-4 text-xs' : 'w-10 text-sm',
        status === 'correct' &&
          'border-transparent bg-green-600 text-white hover:bg-green-700 hover:text-white',

        status === 'present' &&
          'border-transparent bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white',

        status === 'absent' &&
          'bg-muted-foreground/50 text-muted-foreground hover:bg-muted-foreground/50 border-transparent',
      )}
    >
      {value}
    </Button>
  );
}
