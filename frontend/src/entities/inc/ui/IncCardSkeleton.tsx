import { Skeleton } from '@/shared/ui/skeleton';

export function IncCardSkeleton() {
  return (
    <div className="border border-border rounded-2xl bg-background shadow-lg overflow-hidden flex flex-col h-full max-h-55">
      <div className="p-4 flex flex-col flex-1">
        <div className="h-5.5 overflow-hidden">
          <Skeleton className="h-4.5 w-48" />
        </div>

        <div className="flex items-start gap-3.5 mt-3.5 flex-1">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

          <div className="flex flex-col flex-1 gap-1.5 mt-0.5">
            <div className="h-4.5 flex items-center">
              <Skeleton className="h-3.5 w-28" />
            </div>

            <div className="space-y-1.5 mt-1.5 h-15.5 overflow-hidden">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-[85%]" />
              <Skeleton className="h-3.5 w-[60%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-14" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
