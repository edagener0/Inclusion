import type { ReactNode } from 'react';

type Props = {
  username: string;
  userAvatarSlot: ReactNode;
};

export function StoryCard({ username, userAvatarSlot }: Props) {
  return (
    <button className="group flex cursor-pointer flex-col items-center gap-1.5 outline-none">
      <div className="rounded-full bg-linear-to-tr from-amber-500 via-pink-500 to-purple-500 p-0.5 transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95">
        <div className="border-background bg-background flex items-center justify-center overflow-hidden rounded-full border-2">
          {userAvatarSlot}
        </div>
      </div>

      <span className="text-muted-foreground group-hover:text-foreground w-16 truncate text-center text-[12px] font-medium transition-colors">
        {username}
      </span>
    </button>
  );
}
