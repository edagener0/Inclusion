import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function PostCardSkeleton() {
  return (
    <Card className="w-full max-w-10/12 mx-auto overflow-hidden border sm:rounded-xl bg-background p-0 gap-0">
      <CardHeader className="flex flex-row items-center justify-between px-3 pt-2 pb-2 space-y-0 border-none">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 border-y border-border/50">
        <div className="relative flex w-full items-center justify-center bg-black/5 dark:bg-black/40">
          <Skeleton className="w-full aspect-square rounded-none" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start p-3 pt-1 gap-1.5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 -ml-2">
            <Skeleton className="h-9 w-9 rounded-full ml-2" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="w-full space-y-2 mt-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      </CardFooter>
    </Card>
  );
}
