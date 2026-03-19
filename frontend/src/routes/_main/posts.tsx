import { Outlet, createFileRoute } from '@tanstack/react-router';

import { PostList } from '@/widgets/post-list';

export const Route = createFileRoute('/_main/posts')({
  component: PostsLayout,
});

function PostsLayout() {
  return (
    <div className="relative">
      <PostList />
      <Outlet />
    </div>
  );
}
