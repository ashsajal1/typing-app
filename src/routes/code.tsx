import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/code')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/code"!</div>
}
