import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface KeyboardState {
  /** Whether the on-screen keyboard with the animated hands is shown. */
  showVirtualKeyboard: boolean;
  toggleVirtualKeyboard: () => void;
}

export const useKeyboardStore = create<KeyboardState>()(
  persist(
    (set) => ({
      showVirtualKeyboard: true,
      toggleVirtualKeyboard: () =>
        set((state) => ({ showVirtualKeyboard: !state.showVirtualKeyboard })),
    }),
    { name: 'virtual-keyboard' }
  )
);

export default useKeyboardStore;
