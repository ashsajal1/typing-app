import { createFileRoute } from '@tanstack/react-router'
import { SEO } from '../components/SEO'
import { ArrowLeft, HomeIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import GlobalStats from '../components/GlobalStats'

export const Route = createFileRoute('/stats')({
  component: () => (
    <>
      <SEO 
        title="Statistics"
        description="View your typing statistics and track your progress over time. Analyze your typing speed, accuracy, and improvement trends."
        keywords={['typing stats', 'progress tracking', 'typing analytics', 'performance metrics']}
      />
      <StatsComponent />
    </>
  ),
})

function StatsComponent() {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-base-100 flex items-start justify-center pt-8 relative">
      <div className="w-full max-w-6xl px-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Your Typing Statistics
          </h1>
          <p className="text-base-content/70">
            Track your progress and improvement over time
          </p>
        </div>

        <div className="space-y-6">
          {/* Global Error Statistics */}
          <GlobalStats />

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t border-base-300">
            <button
              onClick={() => history.back()}
              className="btn btn-primary btn-outline"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <Link to="/">
              <button className="btn btn-primary btn-outline">
                <HomeIcon className="h-5 w-5" />
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

