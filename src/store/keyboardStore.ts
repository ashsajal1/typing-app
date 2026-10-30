import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface KeyboardState {
  soundEnabled: boolean;
  toggleSound: () => void;
  /** Whether the on-screen keyboard with the animated hands is shown. */
  showVirtualKeyboard: boolean;
  toggleVirtualKeyboard: () => void;
}

export const useKeyboardStore = create<KeyboardState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),
      showVirtualKeyboard: true,
      toggleVirtualKeyboard: () =>
        set((state) => ({ showVirtualKeyboard: !state.showVirtualKeyboard })),
    }),
    { name: 'virtual-keyboard' }
  )
);

export default useKeyboardStore;
