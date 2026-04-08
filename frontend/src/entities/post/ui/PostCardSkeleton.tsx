import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function PostCardSkeleton() {
  return (
    <Card className="bg-background mx-auto w-full max-w-10/12 gap-0 overflow-hidden border p-0 sm:rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-none px-3 pt-2 pb-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="border-border/50 border-y p-0">
        <div className="relative flex w-full items-center justify-center bg-black/5 dark:bg-black/40">
          <Skeleton className="aspect-square w-full rounded-none" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-1.5 p-3 pt-1">
        <div className="flex w-full items-center justify-between">
          <div className="-ml-2 flex items-center gap-2">
            <Skeleton className="ml-2 h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="mt-2 w-full space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      </CardFooter>
    </Card>
  );
}
