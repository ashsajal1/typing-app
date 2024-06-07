import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useSentenceStore } from '../store/sentenceStore'
import TypingTest from '../components/TypingTest'
import { shuffleArray } from '../lib/utils'
import { ArrowLeft, HomeIcon } from 'lucide-react'

const topicsSearchSchema = z.object({
  topic: z.string().catch('biology'),
  eclipsedTime: z.number().catch(60),
})
export const Route = createFileRoute('/practice')({
  component: () => <Practice />,
  validateSearch: (search: Record<string, unknown>) => topicsSearchSchema.parse(search)
})

const Practice = () => {
  const { topic, eclipsedTime } = Route.useSearch()
  const sentences = useSentenceStore((state) => state.getSentencesByTopic(topic || ''));
  if (sentences.length === 0) {
    return <div className='grid place-items-center p-12'>
      <div className='flex flex-col items-center'>
        <h1 className='mb-4 font-bold text-3xl'>Not found text of topic {topic}!</h1>

        <div className='flex items-center gap-2'>
          <button onClick={() => history.back()} className='btn btn-success btn-outline'>
            <ArrowLeft className='h-5 w-5' />
            Back
          </button>
          <Link to='/'>
            <button className='btn btn-success btn-outline'>
              <HomeIcon className='h-5 w-5' />
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  }
  return <TypingTest eclipsedTime={eclipsedTime} text={shuffleArray([...sentences]).join(" ").slice(0, 500)} />
}