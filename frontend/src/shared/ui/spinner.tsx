import { Loader2Icon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

function CenterSpinner({ className, ...props }: React.ComponentProps<typeof Spinner>) {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Spinner className={cn('size-6', className)} {...props} />
    </div>
  );
}

export { Spinner, CenterSpinner };
