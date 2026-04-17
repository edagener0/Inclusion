import { useTranslation } from 'react-i18next';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Medal } from 'lucide-react';

import { wordleQueries } from '@/entities/wordle';

import { useInfiniteScroll } from '@/shared/lib/hooks';
import { Badge } from '@/shared/ui/badge';
import { BaseAvatar } from '@/shared/ui/base-avatar';
import { CenterSpinner } from '@/shared/ui/spinner';

export function WordleLeaderboardContent() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    wordleQueries.leaderboard(),
  );
  const { t } = useTranslation(['games']);

  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const leaderboard = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="grid gap-4">
      {leaderboard.map((user, index) => (
        <div
          key={user.id}
          className="bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex w-8 items-center justify-center text-lg font-bold">
              {index === 0 ? (
                <Medal className="h-6 w-6 text-yellow-500" />
              ) : index === 1 ? (
                <Medal className="h-6 w-6 text-gray-400" />
              ) : index === 2 ? (
                <Medal className="h-6 w-6 text-amber-600" />
              ) : (
                <span className="text-muted-foreground">{index + 1}</span>
              )}
            </div>
            <BaseAvatar alt={user.username} src={user.avatar} className="h-10 w-10" />
            <Link
              className="flex flex-col text-left"
              to="/$username"
              params={{ username: user.username }}
            >
              <span className="text-foreground font-semibold">{user.username}</span>
              <span className="text-muted-foreground text-xs">
                {user.firstName} {user.lastName}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                {t('current')}
              </span>
              <Badge variant="secondary" className="mt-1 px-3 font-mono text-lg">
                {user.currentWordleStreak}
              </Badge>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                {t('best')}
              </span>
              <Badge variant="outline" className="mt-1 px-3 font-mono text-lg">
                {user.maxWordleStreak}
              </Badge>
            </div>
          </div>
        </div>
      ))}

      <div
        ref={observerTarget}
        className="text-muted-foreground flex w-full items-center justify-center py-6"
      >
        {isFetchingNextPage && (
          <span className="animate-pulse text-sm font-medium">
            <CenterSpinner className="size-4" />
          </span>
        )}
      </div>
    </div>
  );
}
