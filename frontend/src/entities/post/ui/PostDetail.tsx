import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';

import { useTimeAgo } from '@/shared/lib/hooks';
import { isVideo } from '@/shared/lib/utils';

import type { Post } from '../model/schema';

type Props = {
  post: Post;
  userAvatarSlot?: ReactNode;
  likeSlot?: ReactNode;
  commentsSlot?: ReactNode;
};

export function PostDetail({ userAvatarSlot, post, likeSlot, commentsSlot }: Props) {
  const isMediaVideo = isVideo(post.file);

  return (
    <div className="bg-background mx-auto flex h-full w-full max-w-[100vw] flex-col overflow-hidden border-none shadow-none md:relative md:block md:h-auto md:w-max md:rounded-md">
      <div className="flex w-full shrink-0 items-center justify-center bg-black md:w-auto md:pr-87.5 lg:pr-100">
        {post.file &&
          (isMediaVideo ? (
            <video
              src={post.file}
              controls
              className="block h-auto max-h-[50vh] min-h-[30vh] w-full max-w-full object-contain md:max-h-[90vh] md:min-h-162.5 md:w-auto md:max-w-[calc(100vw-350px)] lg:max-w-[calc(100vw-400px)]"
            />
          ) : (
            <img
              src={post.file}
              alt={post.description || 'Post media'}
              className="block h-auto max-h-[50vh] min-h-[30vh] w-full max-w-full object-contain md:max-h-[90vh] md:min-h-162.5 md:w-auto md:max-w-[calc(100vw-350px)] lg:max-w-[calc(100vw-400px)]"
              loading="lazy"
            />
          ))}
      </div>

      <div className="bg-card border-border z-10 flex min-h-0 w-full flex-1 flex-col md:absolute md:top-0 md:right-0 md:h-full md:w-87.5 md:flex-none md:border-l lg:w-100">
        <div className="border-border relative z-20 flex shrink-0 items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            {userAvatarSlot}
            <div className="flex flex-col justify-center">
              <Link
                to="/$username"
                params={{ username: post.user.username }}
                className="text-sm leading-none font-semibold hover:opacity-70"
              >
                {post.user.username}
              </Link>
              <span className="text-muted-foreground mt-1 text-[11px] leading-none">
                {useTimeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 pt-3">
          {post.description && (
            <div className="custom-scrollbar max-h-[30vh] shrink-0 overflow-y-auto text-[15px] leading-relaxed whitespace-pre-wrap">
              {post.description}
            </div>
          )}

          <div className="min-h-0 flex-1">{commentsSlot}</div>
        </div>

        <div className="border-border shrink-0 border-t">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">{likeSlot}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
