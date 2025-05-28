import { create } from 'zustand';

const useMockThemeStore = create((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state: { isDarkMode: boolean }) => ({ 
    isDarkMode: !state.isDarkMode 
  })),
}));

export default useMockThemeStore; 