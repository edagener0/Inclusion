import { isVideo } from '@/shared/lib/utils';

import type { Story } from '../model/schema';

type Props = {
  story: Omit<Story, 'user'>;
};

export function StoryMedia({ story }: Props) {
  const isVid = isVideo(story.file);
  const className = 'max-h-full w-full object-contain';

  if (isVid) {
    return (
      <video
        key={story.id}
        src={story.file}
        className={className}
        autoPlay
        playsInline
        loop
        muted
      />
    );
  }

  return <img key={story.id} src={story.file} alt="story" className={className} />;
}
