import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, HomeIcon, Copy, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute('/guide')({
  component: RouteComponent,
})

function RouteComponent() {
  const [topic, setTopic] = useState("");
  const [copied, setCopied] = useState(false);

  const prompt = `Write a one-paragraph explanation about ${topic || "[topic]"} in simple English. Add the meaning of most English words (except very common words like a, an, the, this, that, etc.) in Bangla using the format [word](বাংলা অর্থ). Make the paragraph suitable for students learning English vocabulary.`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-start justify-center pt-8 relative">
      <div className="w-full max-w-2xl px-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">AI Content Generation Guide</h1>
          <p className="text-gray-600 dark:text-gray-300">Learn how to create educational content with translations</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Interactive Prompt Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Generate Your Prompt</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your topic (e.g., photosynthesis)"
                  className="input input-bordered flex-1"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <button
                  onClick={handleCopy}
                  className="btn btn-success gap-2"
                  disabled={!topic}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 font-mono text-sm whitespace-pre-wrap">
                  {prompt}
                </p>
              </div>
            </div>
          </div>

          {/* Original Prompt Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">The Original Prompt</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                Write a one-paragraph explanation about [topic] in simple English. Add the meaning of most English words (except very common words like a, an, the, this, that, etc.) in Bangla using the format [word](বাংলা অর্থ). Make the paragraph suitable for students learning English vocabulary.
              </p>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">How to Use</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                <p className="text-gray-700 dark:text-gray-300">
                  Enter your topic in the input field above
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                <p className="text-gray-700 dark:text-gray-300">
                  Click the "Copy" button to copy the generated prompt
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                <p className="text-gray-700 dark:text-gray-300">
                  Paste the prompt into your AI tool of choice
                </p>
              </div>
            </div>
          </div>

          {/* Example Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Example</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Input: "Write a one-paragraph explanation about photosynthesis in simple English..."
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Output: "Photosynthesis is the [process](প্রক্রিয়া) by which plants [convert](রূপান্তর) light energy into chemical energy. During this [amazing](অসাধারণ) [process](প্রক্রিয়া), plants use [sunlight](সূর্যালোক), water, and carbon dioxide to [create](তৈরি) [glucose](গ্লুকোজ) and [oxygen](অক্সিজেন)."
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tips</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Keep topics focused and specific for better results</li>
              <li>Common words like "the", "is", "and" won't have translations</li>
              <li>The translations appear as tooltips while typing</li>
              <li>You can use this for any subject or topic</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => history.back()}
              className="btn btn-success btn-outline"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <Link to="/">
              <button className="btn btn-success btn-outline">
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
