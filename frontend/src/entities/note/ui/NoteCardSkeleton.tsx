import { Skeleton } from '@/shared/ui/skeleton';

export function NoteCardSkeleton() {
  return (
    <div className="flex flex-col items-center w-24 max-w-24 shrink-0 relative">
      <Skeleton className="absolute -top-2 z-10 h-6 w-14 rounded-full shadow-sm border border-border/50" />
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-3.5 w-16 mt-2 rounded-full" />
    </div>
  );
}
