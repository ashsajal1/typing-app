import { useState, useEffect } from "react";
import Result from "./Result";
import TextDisplay from "./TextDisplay";
import StatsDisplay from "./StatsDisplay";
import ControlsDisplay from "./ControlsDisplay";
import CommandPalette from "./CommandPalette";
import MobileInput from "./MobileInput";
import MistakeAlert from "./MistakeAlert";
import { useTypingTest } from "../hooks/useTypingTest";
import { useKeyboardHandler } from "../hooks/useKeyboardHandler";
import { createCommands } from "../lib/commands";

// Add this at the top of the file, after the imports
const typingAnimation = `
@keyframes typing {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.animate-typing {
  animation: typing 0.3s ease-in-out;
}
`;

// Add this right after the typingAnimation constant
const style = document.createElement('style');
style.textContent = typingAnimation;
document.head.appendChild(style);

export default function TypingTest({
  text,
  eclipsedTime,
}: {
  text: string;
  eclipsedTime: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");

  const {
    userInput,
    setUserInput,
    timer,
    isStarted,
    setIsStarted,
    accuracy,
    wpm,
    wpmHistory,
    isSubmitted,
    parsedText,
    mistakes,
    setMistakes,
    setTotalKeystrokes,
    hasMistake,
    setHasMistake,
    showMistakeAlert,
    setShowMistakeAlert,
    lastCorrectPosition,
    setLastCorrectPosition,
    lastTypedPosition,
    setLastTypedPosition,
    currentErrorMap,
    setCurrentErrorMap,
    incorrectNewlinePosition,
    setIncorrectNewlinePosition,
    showHighErrorChars,
    toggleHighErrorChars,
    highErrorChars,
    handleSubmit,
    resetTest,
    addError
  } = useTypingTest(text, eclipsedTime);

  // Check if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleKeyDown = useKeyboardHandler({
    isMobile,
    isStarted,
    setIsStarted,
    showCommandPalette,
    setShowCommandPalette,
    setCommandSearch,
    handleSubmit,
    parsedText,
    hasMistake,
    userInput,
    lastCorrectPosition,
    incorrectNewlinePosition,
    setUserInput,
    setMistakes,
    setHasMistake,
    setShowMistakeAlert,
    setIncorrectNewlinePosition,
    setLastCorrectPosition,
    setLastTypedPosition,
    setTotalKeystrokes,
    setCurrentErrorMap,
    addError,
    resetTest
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted) {
      setIsStarted(true);
    }
    setUserInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e as unknown as KeyboardEvent);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <Result 
          wpm={wpm} 
          accuracy={accuracy} 
          wpmHistory={wpmHistory} 
          currentErrorMap={currentErrorMap}
          currentTotalErrors={mistakes}
        />
      </div>
    );
  }

  return (
    <section className="p-2 flex flex-col gap-3">
      <MistakeAlert 
        show={showMistakeAlert}
        incorrectNewlinePosition={incorrectNewlinePosition}
      />

      <CommandPalette
        showCommandPalette={showCommandPalette}
        commandSearch={commandSearch}
        onCommandSearchChange={setCommandSearch}
        onCommandSelect={(cmd) => {
          cmd.action();
          setShowCommandPalette(false);
          setCommandSearch("");
        }}
        commands={createCommands(handleSubmit)}
      />

      {eclipsedTime !== Infinity && (
        <progress
          className="progress progress-success w-full"
          value={timer}
          max={eclipsedTime}
        ></progress>
      )}

      {/* Mobile input field */}
      {isMobile && !isSubmitted && (
        <MobileInput
          userInput={userInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      )}

      <div className="flex flex-col gap-4">
        <TextDisplay
          parsedText={parsedText}
          userInput={userInput}
          isStarted={isStarted}
          showHighErrorChars={showHighErrorChars}
          highErrorChars={highErrorChars}
          incorrectNewlinePosition={incorrectNewlinePosition}
          lastTypedPosition={lastTypedPosition}
        />
        <input
          type="text"
          className="input input-bordered w-full md:hidden"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          disabled={!isStarted || isSubmitted}
          placeholder="Type here..."
          autoFocus
        />
      </div>

      <StatsDisplay
        timer={timer}
        eclipsedTime={eclipsedTime}
        accuracy={accuracy}
        wpm={wpm}
      />

      <ControlsDisplay
        showHighErrorChars={showHighErrorChars}
        toggleHighErrorChars={toggleHighErrorChars}
        onReset={() => window.location.reload()}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
