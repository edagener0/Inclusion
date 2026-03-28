import { Skeleton } from '@/shared/ui/skeleton';

export function CommentCardSkeleton() {
  return (
    <div className="flex gap-3 py-3 border-b border-border/50 last:border-0">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
