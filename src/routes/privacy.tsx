import { createFileRoute } from '@tanstack/react-router'
import { SEO } from '../components/SEO'
import { ArrowLeft, HomeIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: () => (
    <>
      <SEO 
        title="Privacy Policy"
        description="Learn about how we collect, use, and protect your data in our typing practice application. Read our privacy policy to understand your rights and our practices."
        keywords={['privacy policy', 'data protection', 'typing app privacy', 'user data']}
      />
      <PrivacyComponent />
    </>
  ),
})

function PrivacyComponent() {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-base-100 flex items-start justify-center pt-8 relative">
      <div className="w-full max-w-4xl px-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Privacy Policy
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
                We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our typing practice application and tell you about your privacy rights.
              </p>
            </div>
          </div>

          {/* Data Collection */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Data We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-base-content mb-2">Practice Data</h3>
                  <ul className="list-disc list-inside text-base-content/80 space-y-2">
                    <li>Typing speed and accuracy metrics</li>
                    <li>Practice session duration</li>
                    <li>Error patterns and statistics</li>
                    <li>Custom text content you create</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-base-content mb-2">Usage Data</h3>
                  <ul className="list-disc list-inside text-base-content/80 space-y-2">
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Time and date of access</li>
                    <li>Pages visited</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                How We Use Your Data
              </h2>
              <div className="space-y-4">
                <p className="text-base-content/80">
                  We use your data to:
                </p>
                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                  <li>Provide and improve our typing practice services</li>
                  <li>Track your progress and show statistics</li>
                  <li>Personalize your practice experience</li>
                  <li>Analyze and improve our application</li>
                  <li>Ensure the security of our services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Storage */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Data Storage
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                Your practice data is stored locally in your browser using localStorage. We do not store your personal data on our servers. This means your data remains on your device and is not transmitted to our servers.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Your Rights
              </h2>
              <div className="space-y-4">
                <p className="text-base-content/80">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-base-content/80 space-y-2">
                  <li>Access your practice data</li>
                  <li>Delete your practice data</li>
                  <li>Export your practice data</li>
                  <li>Clear your browser's localStorage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">
                Contact Us
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us through our GitHub repository or Twitter account.
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