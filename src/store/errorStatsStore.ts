import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ErrorStats {
  totalErrors: number;
  errorMap: Record<string, number>;
  lastUpdated: string;
}

interface ErrorStatsStore {
  errorStats: ErrorStats;
  addError: (key: string) => void;
  resetStats: () => void;
}

const initialErrorStats: ErrorStats = {
  totalErrors: 0,
  errorMap: {},
  lastUpdated: new Date().toISOString(),
};

export const useErrorStatsStore = create<ErrorStatsStore>()(
  persist(
    (set) => ({
      errorStats: initialErrorStats,
      addError: (key: string) =>
        set((state) => {
          const newErrorMap = { ...state.errorStats.errorMap };
          newErrorMap[key] = (newErrorMap[key] || 0) + 1;
          return {
            errorStats: {
              totalErrors: state.errorStats.totalErrors + 1,
              errorMap: newErrorMap,
              lastUpdated: new Date().toISOString(),
            },
          };
        }),
      resetStats: () =>
        set({
          errorStats: initialErrorStats,
        }),
    }),
    {
      name: 'error-stats-storage',
    }
  )
); 