import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function FriendCardSkeleton() {
  return (
    <Card className="border-none bg-zinc-50 dark:bg-zinc-900/40">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-10 rounded-md" />
      </CardContent>
    </Card>
  );
}
