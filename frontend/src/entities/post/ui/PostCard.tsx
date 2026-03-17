import { Heart, MessageCircle, Share2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';

import { type Post } from '../model/types';

export function PostCard({ post }: { post: Post }) {
  return (
    <Card key={post.id}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={`https://i.pravatar.cc/150?u=${post}`} />
          <AvatarFallback>U{post.user.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Пользователь {post.user.username}</span>
          <span className="text-xs text-muted-foreground">2 часа назад</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">
          Это пример поста в ленте. Теперь Layout (Хедер и Сайдбар) находятся в Root, а Index
          отвечает только за центральную колонку с новостями. Архитектура работает!
        </p>
        {/* Плейсхолдер для картинки */}
        <div className="mt-3 h-64 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
          Media Content
        </div>
      </CardContent>
      <CardFooter className="border-t py-2 flex justify-between">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Heart className="h-4 w-4" /> 24
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <MessageCircle className="h-4 w-4" /> 5
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
