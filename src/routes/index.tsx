import { createFileRoute } from '@tanstack/react-router'
import App from '../App'
import { SEO } from '../components/SEO'

export const Route = createFileRoute('/')({
  component: () => (
    <>
      <SEO 
        title="Home"
        description="Improve your typing speed and accuracy with our modern typing practice application. Practice with various topics and track your progress."
        keywords={['typing practice', 'speed test', 'keyboard practice', 'typing improvement']}
      />
      <App />
    </>
  ),
})