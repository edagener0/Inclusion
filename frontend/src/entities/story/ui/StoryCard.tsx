import type { ReactNode } from 'react';

type Props = {
  username: string;
  userAvatarSlot: ReactNode;
};

export function StoryCard({ username, userAvatarSlot }: Props) {
  return (
    <button className="flex flex-col items-center gap-1.5 group cursor-pointer outline-none">
      <div className="rounded-full bg-linear-to-tr from-amber-500 via-pink-500 to-purple-500 p-0.5 transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95">
        <div className="rounded-full border-2 border-background bg-background overflow-hidden flex items-center justify-center">
          {userAvatarSlot}
        </div>
      </div>

      <span className="text-[12px] font-medium text-muted-foreground transition-colors group-hover:text-foreground truncate w-16 text-center">
        {username}
      </span>
    </button>
  );
}
