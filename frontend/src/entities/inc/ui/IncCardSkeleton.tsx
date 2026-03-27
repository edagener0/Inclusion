import { Skeleton } from '@/shared/ui/skeleton';

export function IncCardSkeleton() {
  return (
    <article className="w-full max-w-150 mx-auto flex gap-3 px-4 pt-3 pb-2 border-b border-border bg-background">
      <div className="shrink-0">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="flex flex-col w-full min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>

          <div className="shrink-0 -mt-2 -mr-2">
            <Skeleton className="h-8 w-8 rounded-full m-2" />
          </div>
        </div>

        <div className="mt-2.5 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[90%]" />
          <Skeleton className="h-3.5 w-[60%]" />
        </div>

        <div className="flex items-center justify-start gap-12 mt-3 max-w-md">
          <div className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>

          <div className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
