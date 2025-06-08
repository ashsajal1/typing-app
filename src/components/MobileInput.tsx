interface MobileInputProps {
  userInput: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function MobileInput({
  userInput,
  onChange,
  onKeyDown
}: MobileInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 dark:bg-gray-800 border-t dark:border-gray-700 p-2 z-50">
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="input input-bordered w-full"
          placeholder="Start typing..."
          autoFocus
          style={{ 
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            opacity: '0',
            pointerEvents: 'none',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        />
        <div className="text-sm text-base-content/70 text-center py-2">
          Type in the input field above
        </div>
      </div>
    </div>
  );
} 