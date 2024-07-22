import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => {
        set((state) => {
          const newTheme = !state.isDarkMode ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", newTheme);
          return { isDarkMode: !state.isDarkMode };
        });
      },
    }),
    {
      name: "theme", // name of the item in local storage
      onRehydrateStorage: () => (state) => {
        const theme = state?.isDarkMode ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
      },
    }
  )
);

export default useThemeStore;
