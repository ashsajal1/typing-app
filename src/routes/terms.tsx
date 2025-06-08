import { createFileRoute } from '@tanstack/react-router'
import { SEO } from '../components/SEO'
import { ArrowLeft, HomeIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: () => (
    <>
      <SEO 
        title="Terms of Service"
        description="Read our terms of service to understand the rules and guidelines for using our typing practice application. Learn about your responsibilities and our terms of use."
        keywords={['terms of service', 'terms of use', 'typing app terms', 'user agreement']}
      />
      <TermsComponent />
    </>
  ),
})

function TermsComponent() {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-base-100 flex items-start justify-center pt-8 relative">
      <div className="w-full max-w-4xl px-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Terms of Service
          </h1>
          <p className="text-base-content/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Introduction
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                Welcome to Typing Practice. By using our application, you agree to these terms of service. Please read them carefully before using our services.
              </p>
            </div>
          </div>

          {/* Acceptance of Terms */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                By accessing or using our typing practice application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.
              </p>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                User Responsibilities
              </h2>
              <div className="space-y-4">
                <p className="text-base-content/80">
                  As a user of our application, you agree to:
                </p>
                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                  <li>Use the application for its intended purpose</li>
                  <li>Not attempt to manipulate or cheat the system</li>
                  <li>Not use the application for any illegal purposes</li>
                  <li>Not share inappropriate or offensive content</li>
                  <li>Respect the privacy of other users</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Intellectual Property
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                The application, including its original content, features, and functionality, is owned by Typing Practice and is protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Limitation of Liability
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                Our application is provided "as is" without any warranties. We are not liable for any damages arising from the use or inability to use our application.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Changes to Terms
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Contact Us
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our GitHub repository or Twitter account.
              </p>
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