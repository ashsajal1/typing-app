import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LessonScore { accuracy: number; wpm: number }
interface LessonProgress {
  completed: Record<string, LessonScore>;
  complete: (id: string, score: LessonScore) => void;
}
export const useLessonStore = create<LessonProgress>()(persist((set) => ({
  completed: {},
  complete: (id, score) => set(state => ({ completed: { ...state.completed,
    [id]: !state.completed[id] || score.accuracy >= state.completed[id].accuracy ? score : state.completed[id],
  } })),
}), { name: 'typing-lessons-progress' }));
