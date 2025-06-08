import { createFileRoute } from '@tanstack/react-router'
import { SEO } from '../components/SEO'

export const Route = createFileRoute('/stats')({
  component: () => (
    <>
      <SEO 
        title="Statistics"
        description="View your typing statistics and track your progress over time. Analyze your typing speed, accuracy, and improvement trends."
        keywords={['typing stats', 'progress tracking', 'typing analytics', 'performance metrics']}
      />
      <div>Stats Page</div>
    </>
  ),
})

