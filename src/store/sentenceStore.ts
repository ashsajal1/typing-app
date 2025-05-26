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
  getCompleteSentences: (topic: string, maxLength: number) => string;
}

// Initial sentences data
// Convert all sentence ids to string
const initialSentences: Sentence[] = sentences.map((sentence) => ({
  ...sentence,
  id: sentence.id.toString(), // Convert id to string if it's a number
}));

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
  getCompleteSentences: (topic: string, maxLength: number) => {
    const state = get();
    const topicSentences = state.sentences
      .filter((sentence) => sentence.topic === topic)
      .map((sentence) => sentence.text);
    
    let result = "";
    for (const sentence of topicSentences) {
      // Check if adding this sentence would exceed maxLength
      if (result.length + sentence.length + 1 > maxLength) {
        break;
      }
      // Add sentence with a space if not the first sentence
      result += (result ? " " : "") + sentence;
    }
    return result;
  },
}));
