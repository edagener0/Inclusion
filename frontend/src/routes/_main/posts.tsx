import { createFileRoute } from '@tanstack/react-router';

import { PostList } from '@/widgets/post-list';

export const Route = createFileRoute('/_main/posts')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PostList />;
}
