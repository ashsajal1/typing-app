import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useSentenceStore } from "../store/sentenceStore";
import TypingTest from "../components/TypingTest";
import { shuffleArray } from "../lib/utils";
import { ArrowLeft, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { deobfuscateText } from "../lib/obfuscation"; // Import deobfuscation util

// No need to pass all params in URL if loading from localStorage by ID
const practiceSearchSchema = z.object({
  topic: z.string().optional(),
  eclipsedTime: z.number().optional().catch(60).optional(),
  savedTextId: z.number().optional(), // Will use this to load all details from localStorage
});

export const Route = createFileRoute("/practice")({
  component: () => <Practice />,
  validateSearch: (search: Record<string, unknown>) =>
    practiceSearchSchema.parse(search),
});

// Type for items stored in localStorage
interface SavedPracticeData {
  id: number;
  label: string;
  text: string; // Raw text or Base64 string if obfuscated
  language: "python" | "cpp" | "plaintext";
  isObfuscated: boolean;
  time?: string; // From previous implementation
}


const Practice = () => {
  const { topic, eclipsedTime, savedTextId } = Route.useSearch();
  const [practiceItem, setPracticeItem] = useState<Omit<SavedPracticeData, 'isObfuscated' | 'time'> & { text: string } | null>(null); // Text will be deobfuscated

  useEffect(() => {
    if (savedTextId) {
      const storedCustomTexts = localStorage.getItem("customTextData");
      if (storedCustomTexts) {
        const customTextsArray: SavedPracticeData[] = JSON.parse(storedCustomTexts);
        const foundItem = customTextsArray.find(item => item.id === savedTextId);

        if (foundItem) {
          let finalText = foundItem.text;
          if (foundItem.isObfuscated) {
            finalText = deobfuscateText(foundItem.text);
          }
          setPracticeItem({
            id: foundItem.id,
            label: foundItem.label,
            text: finalText,
            language: foundItem.language,
          });
        } else {
          setPracticeItem(null); // Item not found
        }
      }
    } else {
      setPracticeItem(null); // No savedTextId
    }
  }, [savedTextId]);

  const sentences = useSentenceStore((state) =>
    state.getSentencesByTopic(topic || "")
  );

  // Loading state for saved text
  if (savedTextId && !practiceItem) {
    return (
      <div className="grid place-items-center p-12">
        <span className="loading loading-lg text-success"></span>
        <p className="mt-2">Chargement du texte personnalisé...</p>
      </div>
    );
  }

  // If a practiceItem is loaded (custom text)
  if (practiceItem) {
    return (
      <TypingTest
        eclipsedTime={eclipsedTime || Infinity}
        text={practiceItem.text} // Already deobfuscated
        language={practiceItem.language}
      />
    );
  }

  // Fallback to topic-based sentences if no savedTextId or practiceItem not found
  if (topic && sentences.length > 0) {
    return (
      <TypingTest
        eclipsedTime={eclipsedTime || 60}
        text={shuffleArray([...sentences]).join(" ").slice(0, 500)}
        language={"plaintext"}
      />
    );
  }
  
  // Default/Error case: No valid text source found
  return (
    <div className="grid place-items-center p-12">
      <div className="flex flex-col items-center">
        <h1 className="mb-4 font-bold text-3xl text-center">
          {topic ? `Aucune phrase trouvée pour le sujet : ${topic}.` : "Aucun texte sélectionné pour l'entraînement."}
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => history.back()} className="btn btn-success btn-outline">
            <ArrowLeft className="h-5 w-5" /> Retour
          </button>
          <Link to="/" className="btn btn-success btn-outline">
            <HomeIcon className="h-5 w-5" /> Aller à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};