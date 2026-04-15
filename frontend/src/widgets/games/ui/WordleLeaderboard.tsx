import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import { Medal, Trophy, Users } from 'lucide-react';

import { wordleQueries } from '@/entities/wordle';

import { Badge } from '@/shared/ui/badge';
import { BaseAvatar } from '@/shared/ui/base-avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';

export function WordleLeaderboard() {
  const { data: leaderboard, isLoading } = useQuery(wordleQueries.leaderboard());
  const { t } = useTranslation(['games']);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Spinner className="h-12 w-12" />
        <p className="text-muted-foreground mt-4">{t('wordleLeaderboard.loading')}</p>
      </div>
    );
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-2xl border-none bg-transparent px-4 shadow-none">
      <CardHeader className="px-0 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <CardTitle className="text-3xl font-bold">{t('wordleLeaderboard.title')}</CardTitle>
        </div>
        <CardDescription>{t('wordleLeaderboard.bestPlayers')}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid gap-4">
          {leaderboard?.map((user, index) => (
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
                <div className="flex flex-col text-left">
                  <span className="text-foreground font-semibold">{user.username}</span>
                  <span className="text-muted-foreground text-xs">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
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

          {(!leaderboard || leaderboard.length === 0) && (
            <div className="bg-muted/30 rounded-xl border-2 border-dashed py-12 text-center">
              <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground font-medium">{t('emptyState')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
