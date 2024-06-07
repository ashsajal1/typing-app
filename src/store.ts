import create from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const useStore = create(
    persist<StoreState>(
        (set) => ({
            isDarkMode: false,
            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        }),
        {
            name: 'theme',
        }
    )
);

export default useStore;
