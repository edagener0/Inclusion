import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';

import { useTimeAgo } from '@/shared/lib/hooks';
import { isVideo } from '@/shared/lib/utils';
import { BaseAvatar } from '@/shared/ui/base-avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';

import { type Post } from '../model/schema';

type Props = {
  post: Post;
  nameSlot: ReactNode;
  likeSlot: ReactNode;
  actionsSlot?: ReactNode;
};

export function PostCard({ nameSlot, likeSlot, actionsSlot, post }: Props) {
  const isMediaVideo = isVideo(post.file);

  return (
    <Card
      key={post.id}
      className="bg-background mx-auto w-full max-w-10/12 gap-0 overflow-hidden border p-0 sm:rounded-xl"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-none px-3 pt-2 pb-2">
        <div className="flex items-center gap-3">
          <BaseAvatar src={post.user.avatar} alt={post.user.username} />

          <div className="flex flex-col">
            {nameSlot}

            <Link to="/posts/$id" params={{ id: String(post.id) }} resetScroll={false}>
              <span className="text-muted-foreground text-[12px] hover:underline">
                {useTimeAgo(post.createdAt)}
              </span>
            </Link>
          </div>
        </div>

        <div>{actionsSlot}</div>
      </CardHeader>
      <CardContent className="border-border/50 border-y p-0">
        <div className="relative flex w-full items-center justify-center bg-black/5 dark:bg-black/40">
          {isMediaVideo ? (
            <video
              src={post.file}
              controls
              playsInline
              className="block h-auto w-full"
              preload="metadata"
            />
          ) : (
            <img
              src={post.file}
              alt={post.description || 'Post media'}
              className="block h-auto w-full"
              loading="lazy"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1.5 p-3 pt-1">
        <div className="flex w-full items-center justify-between">
          <div className="-ml-2 flex items-center gap-2">
            {likeSlot}

            <Link to="/posts/$id" params={{ id: String(post.id) }} resetScroll={false}>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-muted-foreground h-9 w-9 transition-colors hover:bg-transparent"
              >
                <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>

        {post.description && (
          <div className="w-full text-[14px] leading-4.5">
            <Link to="/$username" params={{ username: post.user.username }}>
              <span className="text-foreground mr-2 cursor-pointer font-bold hover:underline">
                {post.user.username}
              </span>
            </Link>
            <span className="text-foreground/90 wrap-break-word whitespace-pre-wrap">
              {post.description}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
