import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';

export function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
        </div>
        <div className="mt-3 h-64 bg-muted animate-pulse rounded-md" />
      </CardContent>
      <CardFooter className="border-t py-2 flex justify-between">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </CardFooter>
    </Card>
  );
}
