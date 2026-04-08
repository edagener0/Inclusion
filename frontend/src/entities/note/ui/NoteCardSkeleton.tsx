import { Skeleton } from '@/shared/ui/skeleton';

export function NoteCardSkeleton() {
  return (
    <div className="relative flex w-24 max-w-24 shrink-0 flex-col items-center">
      <Skeleton className="border-border/50 absolute -top-2 z-10 h-6 w-14 rounded-full border shadow-sm" />
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="mt-2 h-3.5 w-16 rounded-full" />
    </div>
  );
}
