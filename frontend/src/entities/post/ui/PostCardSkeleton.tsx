import { Skeleton } from '@/shared/ui/skeleton';

export function PostCardSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border border-border rounded-xl bg-background shadow-sm">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

      <div className="flex flex-col flex-1 gap-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4.5 w-32" />
          <Skeleton className="h-3.5 w-20" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3.5 w-[90%]" />
          <Skeleton className="h-3.5 w-[75%]" />
        </div>

        <div className="flex gap-2.5 mt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
