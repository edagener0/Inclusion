import { MessageCircle, MoreHorizontal } from 'lucide-react';

import { UserAvatar, useGetUserByUsername } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

export function ProfileHeader({ username }: { username: string }) {
  const { data: user, isLoading } = useGetUserByUsername(username);

  if (isLoading) return <>Loading page..</>;
  if (!user) return null;

  return (
    <Card>
      <CardContent className="pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <UserAvatar size="profile" username={user.username} url={user.avatar} />

          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">{user.id}</p>

            {/* Кнопки действий */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              <Button>Добавить в друзья</Button>
              <Button variant="secondary" size="icon">
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Статистика вынесена вправо (или вниз на мобильных) */}
          <div className="flex gap-6 text-center text-sm sm:ml-auto bg-muted/30 p-4 rounded-lg">
            <div className="cursor-pointer">
              <span className="block font-semibold text-lg">142</span>
              <span className="text-muted-foreground hover:text-foreground">друга</span>
            </div>
            <div className="cursor-pointer">
              <span className="block font-semibold text-lg">85</span>
              <span className="text-muted-foreground hover:text-foreground">подписчиков</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
