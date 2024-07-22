import { create } from "zustand";
import { sentences } from "../lib/topics";

// Define the type for a sentence
type Sentence = {
  id: string;
  text: string;
  topic: string;
};

// Define the type for the store's state
interface SentenceStore {
  sentences: Sentence[];
  getSentencesByTopic: (topic: string) => string[];
  getAllTopics: () => string[];
}

// Initial sentences data
const initialSentences: Sentence[] = sentences;

// Create the Zustand store with TypeScript types
export const useSentenceStore = create<SentenceStore>((_set, get) => ({
  sentences: initialSentences,
  getSentencesByTopic: (topic: string) => {
    const state = get();
    return state.sentences
      .filter((sentence) => sentence.topic === topic)
      .map((sentence) => sentence.text);
  },
  getAllTopics: () => {
    const state = get();
    const topics = state.sentences.map((sentence) => sentence.topic);
    return Array.from(new Set(topics));
  },
}));
