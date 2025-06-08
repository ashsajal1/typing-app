import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useSentenceStore } from "../store/sentenceStore";
import TypingTest from "../components/TypingTest";
import BengaliTyping from "../components/BengaliTyping";
import { ArrowLeft, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SEO } from '../components/SEO'
import { franc } from 'franc';

const topicsSearchSchema = z.object({
  topic: z.string(),
  eclipsedTime: z.number(),
  savedTextId: z.number().optional(),
});

export const Route = createFileRoute("/practice")({
  component: PracticeComponent,
  validateSearch: (search: Record<string, unknown>) =>
    topicsSearchSchema.parse(search),
});

function PracticeComponent() {
  const { topic, eclipsedTime, savedTextId } = Route.useSearch();
  const [savedSentence, setSavedSentence] = useState<{
    id: number;
    label: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    if (savedTextId) {
      const text = localStorage.getItem("customTextData");
      if (text) {
        const textArray = JSON.parse(text);
        const savedSentenceObj = textArray.find(
          (item: { id: number; label: string; text: string }) =>
            item.id === savedTextId
        );
        if (savedSentenceObj) {
          setSavedSentence(savedSentenceObj);
        }
      }
    }
  }, [savedTextId]);

  const getCompleteSentences = useSentenceStore((state) => state.getCompleteSentences);
  const sentences = topic ? getCompleteSentences(topic, 1000) : "";

  if (!sentences && savedSentence === null) {
    return (
      <>
        <SEO 
          title="Practice"
          description="Start your typing practice session. Choose from various topics and customize your practice duration. Track your typing speed and accuracy in real-time."
          keywords={['typing practice', 'speed test', 'accuracy', 'typing session', 'practice mode']}
        />
        <div className="grid place-items-center p-12">
          <div className="flex flex-col items-center">
            <h1 className="mb-4 font-bold text-3xl text-center">
              Not found text of topic {topic}!
            </h1>

            <div className="flex items-center gap-2">
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
      </>
    );
  }

  const textToType = savedSentence ? savedSentence.text : sentences;
  // Use franc to detect language
  const lang = franc(textToType || '');
  const isBengali = lang === 'ben';

  return (
    <>
      <SEO 
        title="Practice"
        description="Start your typing practice session. Choose from various topics and customize your practice duration. Track your typing speed and accuracy in real-time."
        keywords={['typing practice', 'speed test', 'accuracy', 'typing session', 'practice mode']}
      />
      {isBengali ? (
        <BengaliTyping />
      ) : (
        <TypingTest
          eclipsedTime={eclipsedTime || 60}
          text={textToType}
        />
      )}
    </>
  );
}