import { useKeyboardStore } from '../store/keyboardStore';
interface ControlsDisplayProps {
  showHighErrorChars: boolean;
  toggleHighErrorChars: () => void;
  showVirtualKeyboard: boolean;
  toggleVirtualKeyboard: () => void;
  onReset: () => void;
  onSubmit: () => void;
}

export default function ControlsDisplay({
  showHighErrorChars,
  toggleHighErrorChars,
  showVirtualKeyboard,
  toggleVirtualKeyboard,
  onReset,
  onSubmit,
}: ControlsDisplayProps) {
  const { soundEnabled, toggleSound } = useKeyboardStore();
  return (
    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="label cursor-pointer gap-2">
          <span className="label-text">Typing sound</span>
          <input type="checkbox" className="toggle toggle-success" checked={soundEnabled} onChange={toggleSound} />
        </label>
        <label className="label cursor-pointer gap-2">
          <span className="label-text">Show Error Chars</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={showHighErrorChars}
            onChange={toggleHighErrorChars}
          />
        </label>
        <label className="label cursor-pointer gap-2">
          <span className="label-text">On-screen Keyboard</span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={showVirtualKeyboard}
            onChange={toggleVirtualKeyboard}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="btn btn-outline btn-success group transition-all duration-300 hover:scale-105"
          title="Press Esc to reset"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
        
        <button
          onClick={onSubmit}
          className="btn btn-success transition-all duration-300 hover:scale-105"
          title="Press Enter to finish"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Finish
        </button>
      </div>
    </div>
  );
} 