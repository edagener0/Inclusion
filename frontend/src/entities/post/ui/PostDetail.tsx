import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';

import { isVideo, timeAgo } from '@/shared/lib/utils';

import type { Post } from '../model/types';

type Props = {
  post: Post;
  userAvatarSlot?: ReactNode;
  likeSlot?: ReactNode;
  commentsSlot?: ReactNode;
};

export function PostDetail({ userAvatarSlot, post, likeSlot, commentsSlot }: Props) {
  const isMediaVideo = isVideo(post.file);

  return (
    <div className="flex flex-col md:block md:relative bg-background md:rounded-md overflow-hidden shadow-none border-none mx-auto w-full h-full md:h-auto md:w-max max-w-[100vw]">
      <div className="bg-black flex items-center justify-center shrink-0 w-full md:w-auto md:pr-87.5 lg:pr-100">
        {post.file &&
          (isMediaVideo ? (
            <video
              src={post.file}
              controls
              className="block w-full md:w-auto h-auto min-h-[30vh] md:min-h-162.5 max-h-[50vh] md:max-h-[90vh] max-w-full md:max-w-[calc(100vw-350px)] lg:max-w-[calc(100vw-400px)] object-contain"
            />
          ) : (
            <img
              src={post.file}
              alt={post.description || 'Post media'}
              className="block w-full md:w-auto h-auto min-h-[30vh] md:min-h-162.5 max-h-[50vh] md:max-h-[90vh] max-w-full md:max-w-[calc(100vw-350px)] lg:max-w-[calc(100vw-400px)] object-contain"
              loading="lazy"
            />
          ))}
      </div>

      <div className="w-full flex-1 min-h-0 md:flex-none md:w-87.5 lg:w-100 flex flex-col bg-card md:border-l border-border md:absolute md:top-0 md:right-0 md:h-full z-10">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            {userAvatarSlot}
            <div className="flex flex-col justify-center">
              <Link
                to="/$username"
                params={{ username: post.user.username }}
                className="font-semibold text-sm hover:opacity-70 leading-none"
              >
                {post.user.username}
              </Link>
              <span className="text-[11px] text-muted-foreground mt-1 leading-none">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 p-4 pt-3 gap-4">
          {post.description && (
            <div className="text-[15px] whitespace-pre-wrap leading-relaxed shrink-0 custom-scrollbar overflow-y-auto max-h-[30vh]">
              {post.description}
            </div>
          )}

          <div className="flex-1 min-h-0">{commentsSlot}</div>
        </div>

        <div className="border-t border-border shrink-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">{likeSlot}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
