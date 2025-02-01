import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useSentenceStore } from "../store/sentenceStore";
import TypingTest from "../components/TypingTest";
import { shuffleArray } from "../lib/utils";
import { ArrowLeft, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";

const topicsSearchSchema = z.object({
  topic: z.string().optional(),
  eclipsedTime: z.number().optional().catch(60).optional(),
  savedTextId: z.number().optional(),
});
export const Route = createFileRoute("/practice")({
  component: () => <Practice />,
  validateSearch: (search: Record<string, unknown>) =>
    topicsSearchSchema.parse(search),
});

const Practice = () => {
  const { topic, eclipsedTime, savedTextId } = Route.useSearch();
  const [savedSentence, setSavedSentence] = useState<{
    id: number;
    label: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    if (savedTextId) {
      const text = localStorage.getItem("customTextData");
      const textArray = JSON.parse(text!);
      console.log(textArray);

      const savedSentenceObj = textArray.find(
        (item: { id: number; label: string; text: string }) =>
          item.id === savedTextId
      );

      if(savedSentenceObj === undefined) {
        return;
      }

      console.log("Saved sentence:", savedSentenceObj);

      setSavedSentence(savedSentenceObj);
    }
  }, [savedTextId]);

  const sentences = useSentenceStore((state) =>
    state.getSentencesByTopic(topic || "")
  );

  if (sentences.length === 0 && savedSentence === null) {
    return (
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
    );
  }

  if (savedSentence) {
    return (
      <TypingTest eclipsedTime={Infinity} text={savedSentence.text} />
    );
  }

  return (
    <TypingTest
      eclipsedTime={eclipsedTime || 60}
      text={shuffleArray([...sentences])
        .join(" ")
        .slice(0, 350)}
    />
  );
};
