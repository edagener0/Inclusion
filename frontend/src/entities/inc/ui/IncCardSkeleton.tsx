import { Skeleton } from '@/shared/ui/skeleton';

export function IncCardSkeleton() {
  return (
    <article className="border-border bg-background mx-auto flex w-full max-w-150 gap-3 border-b px-4 pt-3 pb-2">
      <div className="shrink-0">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="flex w-full min-w-0 flex-col">
        <div className="flex items-start justify-between">
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>

          <div className="-mt-2 -mr-2 shrink-0">
            <Skeleton className="m-2 h-8 w-8 rounded-full" />
          </div>
        </div>

        <div className="mt-2.5 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[90%]" />
          <Skeleton className="h-3.5 w-[60%]" />
        </div>

        <div className="mt-3 flex max-w-md items-center justify-start gap-12">
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
