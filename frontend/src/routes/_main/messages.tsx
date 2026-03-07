import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/messages"!</div>
}
