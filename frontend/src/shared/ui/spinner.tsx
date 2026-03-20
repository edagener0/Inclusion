import { Loader2Icon } from 'lucide-react';

import { cn } from '@/shared/lib/utils/utils';

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

function CenterSpinner() {
  return (
    <div className="flex h-full w-full min-h-[50vh] flex-1 items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}

export { Spinner, CenterSpinner };
