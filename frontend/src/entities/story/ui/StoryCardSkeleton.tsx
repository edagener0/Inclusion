import { Skeleton } from '@/shared/ui/skeleton';

export function StoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1.5 outline-none">
      <Skeleton className="h-18 w-18 rounded-full" />
      <Skeleton className="mt-1 h-3 w-12 rounded-full" />
    </div>
  );
}
