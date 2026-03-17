import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';
import { MessageCircle, Share2 } from 'lucide-react';

import { ProfileAvatar } from '@/entities/profile';
import { isVideo } from '@/shared/lib/is-video';
import { timeAgo } from '@/shared/lib/time-ago';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';

import { type Post } from '../model/types';

type Props = {
  post: Post;
  actionsSlot?: ReactNode;
  likeSlot?: ReactNode;
};

export function PostCard({ likeSlot, post, actionsSlot: actions }: Props) {
  const isMediaVideo = isVideo(post.file);

  return (
    <Card key={post.id}>
      <CardHeader className="flex flex-row items-start gap-3 pb-2">
        <ProfileAvatar
          avatar={post.user.avatar}
          username={post.user.username}
          className="h-10 w-10 mt-0.5"
        />
        <div className="flex flex-col min-w-0 w-full">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Link to="/$username" params={{ username: post.user.username }}>
                <span className="font-bold text-[15px] truncate hover:underline cursor-pointer">
                  {post.user.username}
                </span>
              </Link>
              <span className="text-muted-foreground text-[15px]">·</span>
              <span className="text-muted-foreground text-[15px]">{timeAgo(post.createdAt)}</span>
            </div>

            <div>{actions}</div>
          </div>

          <p className="text-[15px] leading-normal text-foreground wrap-break-word whitespace-pre-wrap">
            {post.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="overflow-hidden rounded-md bg-muted">
          {isMediaVideo ? (
            <video
              src={post.file}
              controls
              className="w-full max-h-125 object-contain bg-black"
              preload="metadata"
            />
          ) : (
            <img
              src={post.file}
              alt={post.description || 'Post media'}
              className="w-full max-h-110 object-cover"
              loading="lazy"
            />
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t py-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          {likeSlot}

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Правая часть остается сама по себе */}
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
