import { createFileRoute } from '@tanstack/react-router'
import { SEO } from '../components/SEO'

export const Route = createFileRoute('/about')({
  component: () => (
    <>
      <SEO 
        title="About"
        description="Learn about our typing practice application, its features, and how it can help you improve your typing skills. Discover our mission and goals."
        keywords={['about typing test', 'typing app features', 'typing practice mission', 'typing improvement goals']}
      />
      <div>About Page</div>
    </>
  ),
})