import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, HomeIcon, Copy, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SEO } from "../components/SEO";

export const Route = createFileRoute("/guide")({
  component: () => (
    <>
      <SEO
        title="Typing Guide"
        description="Learn proper typing techniques and best practices. Master touch typing with our comprehensive guide and improve your typing skills."
        keywords={[
          "typing guide",
          "touch typing",
          "typing techniques",
          "keyboard skills",
          "typing tutorial",
        ]}
      />
      <RouteComponent />
    </>
  ),
});

function RouteComponent() {
  const [topic, setTopic] = useState("");
  const [copied, setCopied] = useState(false);

  const prompt = `Write a one-paragraph explanation about ${
    topic || "[topic]"
  } in English. Add the meaning of most English words (except very common words like a, an, the, this, that, etc.) in Bangla using the format [word](বাংলা অর্থ). Make the paragraph suitable for students learning English vocabulary. Do not use any characters or formatting that are not found on a standard keyboard (e.g., avoid special symbols or non-standard punctuation).

Example format:
Photosynthesis is the [process](প্রক্রিয়া) by which plants [convert](রূপান্তর) light energy into chemical energy. During this [amazing](অসাধারণ) [process](প্রক্রিয়া), plants use [sunlight](সূর্যালোক), water, and carbon dioxide to [create](তৈরি) [glucose](গ্লুকোজ) and [oxygen](অক্সিজেন).

Please format the response in Markdown`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-base-100 flex items-start justify-center pt-8 relative">
      <div className="w-full max-w-2xl px-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            AI Content Generation Guide
          </h1>
          <p className="text-base-content/70">
            Learn how to create educational content with translations in
            Markdown format
          </p>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body space-y-6">
            {/* Interactive Prompt Section */}
            <div className="space-y-4">
              <h2 className="card-title text-base-content">
                Generate Your Prompt
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your topic (e.g., photosynthesis)"
                    className="input input-bordered flex-1 bg-base-100 focus:outline-none focus:border-primary"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <button
                    onClick={handleCopy}
                    className="btn btn-primary gap-2"
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
                <div className="card bg-base-100">
                  <div className="card-body p-4">
                    <p className="text-base-content/80 font-mono text-sm whitespace-pre-wrap">
                      {prompt}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Original Prompt Section */}
            <div className="space-y-4">
              <h2 className="card-title text-base-content">
                The Original Prompt
              </h2>
              <div className="card bg-base-100">
                <div className="card-body p-4">
                  <p className="text-base-content/80 font-mono text-sm whitespace-pre-wrap">
                    Write a one-paragraph explanation about [topic] in English.
                    Add the meaning of most English words (except very common
                    words like a, an, the, this, that, etc.) in Bangla using the
                    format [word](বাংলা অর্থ). Make the paragraph suitable for
                    students learning English vocabulary. Format the response in
                    Markdown with a title, the paragraph with translations, and
                    a bullet list of key terms.
                  </p>
                </div>
              </div>
            </div>

            {/* How to Use Section */}
            <div className="space-y-4">
              <h2 className="card-title text-base-content">How to Use</h2>
              <div className="space-y-3">
                {[
                  "Enter your topic in the input field above",
                  'Click the "Copy" button to copy the generated prompt',
                  "Paste the prompt into your AI tool of choice",
                  "The response will be formatted in Markdown with translations",
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="badge badge-primary badge-lg w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-base-content/80">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Example Section */}
            <div className="space-y-4">
              <h2 className="card-title text-base-content">Example Output</h2>
              <div className="card bg-base-100">
                <div className="card-body p-4">
                  <pre className="text-base-content/80 font-mono text-sm whitespace-pre-wrap">
                    {`# Photosynthesis

Photosynthesis is the [process](প্রক্রিয়া) by which plants [convert](রূপান্তর) light energy into chemical energy. During this [amazing](অসাধারণ) [process](প্রক্রিয়া), plants use [sunlight](সূর্যালোক), water, and carbon dioxide to [create](তৈরি) [glucose](গ্লুকোজ) and [oxygen](অক্সিজেন).

## Key Terms
- [process](প্রক্রিয়া) - The way something happens
- [convert](রূপান্তর) - To change from one form to another
- [amazing](অসাধারণ) - Very surprising or impressive
- [sunlight](সূর্যালোক) - Light from the sun
- [create](তৈরি) - To make something new
- [glucose](গ্লুকোজ) - A type of sugar
- [oxygen](অক্সিজেন) - A gas that living things need to breathe`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="space-y-4">
              <h2 className="card-title text-base-content">Tips</h2>
              <ul className="list-disc list-inside space-y-2 text-base-content/80">
                <li>Keep topics focused and specific for better results</li>
                <li>
                  Common words like "the", "is", "and" won't have translations
                </li>
                <li>The translations appear as tooltips while typing</li>
                <li>You can use this for any subject or topic</li>
                <li>
                  The Markdown format makes it easy to use in various platforms
                </li>
              </ul>
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
    </div>
  );
}
