import { Outlet, createFileRoute } from '@tanstack/react-router';

import { PostList } from '@/widgets/post-list';
import { StoriesSection } from '@/widgets/stories/stories-section';

import { postQueries } from '@/entities/post';

export const Route = createFileRoute('/_main/posts')({
  component: function () {
    return (
      <div className="relative">
        <div className="pb-2">
          <StoriesSection />
        </div>
        <PostList queryOptions={postQueries.feed()} />
        <Outlet />
      </div>
    );
  },
});
