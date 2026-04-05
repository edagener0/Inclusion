import { Skeleton } from '@/shared/ui/skeleton';

export function CommentCardSkeleton() {
  return (
    <div className="border-border/50 flex gap-3 border-b py-3 last:border-0">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 pt-0.5">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
