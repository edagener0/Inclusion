import { createFileRoute } from '@tanstack/react-router';
import { Heart, ImageIcon, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';

import { useGetUserByUsername } from '@/entities/user';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { ProfileHeader } from '@/widgets/profile-header';

export const Route = createFileRoute('/_main/$username')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user, isLoading } = useGetUserByUsername(username);

  if (isLoading) return <>Loading page..</>;
  if (!user) return <>User not found</>;

  return (
    <>
      <ProfileHeader username={username} />
      {/* Лента (На всю ширину контейнера) */}
      <div className="space-y-4 pt-2">
        {/* Создание нового поста */}
        <Card>
          <CardContent className="pt-4 flex gap-3 sm:gap-4">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 hidden sm:block">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Что у вас нового?"
                className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background h-12"
              />
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ImageIcon className="w-4 h-4 mr-2" /> Прикрепить фото
                </Button>
                <Button size="sm">Опубликовать</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Пост в ленте */}
        <Card>
          <CardHeader className="py-4 flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm cursor-pointer hover:underline">
                Иван Иванов
              </span>
              <span className="text-xs text-muted-foreground">Сегодня в 14:30</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto -mt-2 -mr-2 text-muted-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base leading-relaxed">
              Обновил дизайн профиля! Убрал лишние блоки с фотографиями и списком друзей с главной
              страницы. Теперь фокус полностью на контенте и постах. Лента стала шире, а шапка
              профиля — аккуратнее. Как вам такой минимализм? ✨
            </p>
          </CardContent>
          <CardFooter className="py-3 flex gap-6 text-muted-foreground border-t bg-muted/10">
            <button className="flex items-center gap-1.5 text-sm hover:text-red-500 transition-colors font-medium">
              <Heart className="w-4 h-4" /> 24
            </button>
            <button className="flex items-center gap-1.5 text-sm hover:text-foreground transition-colors font-medium">
              <MessageCircle className="w-4 h-4" /> 5
            </button>
            <button className="flex items-center gap-1.5 text-sm hover:text-foreground transition-colors ml-auto font-medium">
              <Share2 className="w-4 h-4" /> Поделиться
            </button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
