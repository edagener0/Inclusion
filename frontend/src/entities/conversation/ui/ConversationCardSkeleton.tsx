import { Skeleton } from '@/shared/ui/skeleton';

export function ConversationCardSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b p-3 last:border-0">
      <Skeleton className="h-10 w-10 rounded-full" />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-full max-w-50" />
      </div>
    </div>
  );
}
