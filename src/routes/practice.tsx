import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const topicsSearchSchema = z.object({
  // page: z.number().catch(1),
  // filter: z.string().catch(''),
  // sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
  topic: z.string().catch('').optional()
})
export const Route = createFileRoute('/practice')({
  component: () => <Practice />,
  validateSearch: (search) => topicsSearchSchema.parse(search)
})

const Practice = () => {
  const { topic } = Route.useSearch()
  return <div>Hello /practice! {topic}</div>
}