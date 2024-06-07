import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useSentenceStore } from '../store/sentenceStore'
import TypingTest from '../components/TypingTest'

const topicsSearchSchema = z.object({
  // page: z.number().catch(1),
  // filter: z.string().catch(''),
  // sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
  topic: z.string().catch('biology')
})
export const Route = createFileRoute('/practice')({
  component: () => <Practice />,
  validateSearch: (search) => topicsSearchSchema.parse(search)
})

const Practice = () => {
  const { topic } = Route.useSearch()
  const sentences = useSentenceStore((state) => state.getSentencesByTopic(topic || ''));
  console.log(sentences.sort(() => Math.floor(Math.random() * 3) - 1))
  return <TypingTest text={sentences.sort(() => Math.floor(Math.random() * 3) - 1).join(" ").slice(0, 500)} />
}