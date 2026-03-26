import { Skeleton } from '@/shared/ui/skeleton';

export function StoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1.5 outline-none">
      <Skeleton className="w-18 h-18 rounded-full" />
      <Skeleton className="h-3 w-12 rounded-full mt-1" />
    </div>
  );
}
