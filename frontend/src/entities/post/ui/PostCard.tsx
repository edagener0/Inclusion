import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';

import { isVideo, timeAgo } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';

import { type Post } from '../model/types';

type Props = {
  post: Post;
  userAvatarSlot: ReactNode;
  likeSlot: ReactNode;
  actionsSlot?: ReactNode;
};

export function PostCard({ userAvatarSlot, likeSlot, actionsSlot, post }: Props) {
  const isMediaVideo = isVideo(post.file);

  return (
    <Card
      key={post.id}
      className="w-full max-w-10/12 mx-auto overflow-hidden border sm:rounded-xl bg-background p-0 gap-0"
    >
      <CardHeader className="flex flex-row items-center justify-between px-3 pt-2 pb-2 space-y-0 border-none">
        <div className="flex items-center gap-3">
          {userAvatarSlot}
          <div className="flex flex-col">
            <Link to="/$username" params={{ username: post.user.username }}>
              <span className="font-semibold text-[14px] text-foreground hover:underline cursor-pointer">
                {post.user.username}
              </span>
            </Link>
            <Link to="/posts/$id" params={{ id: String(post.id) }} resetScroll={false}>
              <span className="text-[12px] text-muted-foreground">{timeAgo(post.createdAt)}</span>
            </Link>
          </div>
        </div>
        <div>{actionsSlot}</div>
      </CardHeader>
      <CardContent className="p-0 border-y border-border/50">
        <div className="relative flex w-full items-center justify-center bg-black/5 dark:bg-black/40">
          {isMediaVideo ? (
            <video
              src={post.file}
              controls
              playsInline
              className="w-full h-auto block"
              preload="metadata"
            />
          ) : (
            <img
              src={post.file}
              alt={post.description || 'Post media'}
              className="w-full h-auto block"
              loading="lazy"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-3 pt-1 gap-1.5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 -ml-2">
            {likeSlot}

            <Link to="/posts/$id" params={{ id: String(post.id) }} resetScroll={false}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-foreground hover:text-muted-foreground hover:bg-transparent transition-colors"
              >
                <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>

        {post.description && (
          <div className="w-full text-[14px] leading-4.5 ">
            <Link to="/$username" params={{ username: post.user.username }}>
              <span className="font-bold text-foreground hover:underline cursor-pointer mr-2">
                {post.user.username}
              </span>
            </Link>
            <span className="whitespace-pre-wrap wrap-break-word text-foreground/90">
              {post.description}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
