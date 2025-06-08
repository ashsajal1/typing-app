import { createFileRoute } from '@tanstack/react-router'
import { SEO } from '../components/SEO'
import { ArrowLeft, HomeIcon, Keyboard, Target, Zap, Clock, BookOpen, Code, FileText, Save } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: () => (
    <>
      <SEO 
        title="About"
        description="Learn about our typing practice application, its features, and how it can help you improve your typing skills. Discover our mission and goals."
        keywords={['about typing test', 'typing app features', 'typing practice mission', 'typing improvement goals']}
      />
      <AboutComponent />
    </>
  ),
})

function AboutComponent() {
  const features = [
    {
      icon: <Keyboard className="w-6 h-6 text-primary" />,
      title: "Real-time Practice",
      description: "Practice typing with instant feedback and performance tracking. Monitor your speed and accuracy as you type."
    },
    {
      icon: <Target className="w-6 h-6 text-secondary" />,
      title: "Customizable Sessions",
      description: "Choose from various topics and set your preferred practice duration. Tailor your practice to your needs."
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Performance Analytics",
      description: "Track your progress with detailed statistics and error analysis. Identify areas for improvement."
    },
    {
      icon: <Clock className="w-6 h-6 text-info" />,
      title: "Timed Challenges",
      description: "Test your skills with timed sessions. Choose from 30 seconds to unlimited practice modes."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-success" />,
      title: "Learning Resources",
      description: "Access comprehensive typing guides and tutorials. Learn proper techniques and best practices."
    },
    {
      icon: <Code className="w-6 h-6 text-warning" />,
      title: "Code Practice",
      description: "Specialized practice for programming languages. Improve your coding speed and accuracy."
    },
    {
      icon: <FileText className="w-6 h-6 text-error" />,
      title: "Custom Content",
      description: "Create and import your own practice texts. Personalize your learning experience."
    },
    {
      icon: <Save className="w-6 h-6 text-primary" />,
      title: "Save Progress",
      description: "Save your practice sessions and track your improvement over time."
    }
  ]

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-base-100 flex items-start justify-center pt-8 relative">
      <div className="w-full max-w-6xl px-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            About Typing Practice
          </h1>
          <p className="text-base-content/70">
            Your journey to typing mastery starts here
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission Statement */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Our Mission
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                We're dedicated to helping people improve their typing skills through an engaging and effective practice platform. 
                Our goal is to make typing practice accessible, enjoyable, and productive for everyone, from beginners to advanced users.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-6">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="card bg-base-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body">
                      <div className="flex items-center gap-3 mb-2">
                        {feature.icon}
                        <h3 className="card-title text-lg">{feature.title}</h3>
                      </div>
                      <p className="text-base-content/70">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="badge badge-primary badge-lg w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-1">Choose Your Practice Mode</h3>
                    <p className="text-base-content/70">
                      Select from various practice modes including timed sessions, custom text, or code practice.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="badge badge-primary badge-lg w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-1">Practice and Improve</h3>
                    <p className="text-base-content/70">
                      Type the provided text while receiving real-time feedback on your performance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="badge badge-primary badge-lg w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-1">Track Your Progress</h3>
                    <p className="text-base-content/70">
                      Review your statistics and identify areas for improvement to enhance your typing skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="card bg-primary text-primary-content shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center mb-4">
                Ready to Improve Your Typing?
              </h2>
              <p className="mb-6">
                Start your typing journey today and watch your skills improve with each practice session.
              </p>
              <div className="card-actions justify-center">
                <Link to="/" className="btn btn-secondary">
                  Start Practicing
                </Link>
              </div>
            </div>
          </div>

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