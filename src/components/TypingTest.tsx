import { useCallback, useEffect, useState, useMemo } from "react";
import Result from "./Result";
import { useErrorStatsStore } from '../store/errorStatsStore';
import TextDisplay from "./TextDisplay";
import StatsDisplay from "./StatsDisplay";
import ControlsDisplay from "./ControlsDisplay";
import CommandPalette from "./CommandPalette";

import { ignoredKeys } from "../lib/utils";
import { createCommands } from "../lib/commands";

// Function to parse text with translations
interface TextWithTranslation {
  text: string;
  translation?: string;
}

// Function to parse text with translations
const parseTextWithTranslations = (text: string): TextWithTranslation[] => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: TextWithTranslation[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) });
    }
    // Add the matched text with translation
    parts.push({
      text: match[1],
      translation: match[2]
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  return parts;
};

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
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [wpm, setWpm] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reload, setReload] = useState(false);
  const [textToPractice, setTextToPractice] = useState(text);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [parsedText, setParsedText] = useState<TextWithTranslation[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [hasMistake, setHasMistake] = useState(false);
  const [showMistakeAlert, setShowMistakeAlert] = useState(false);
  const [lastCorrectPosition, setLastCorrectPosition] = useState<number>(-1);
  const [lastTypedPosition, setLastTypedPosition] = useState<number>(-1);
  const [currentErrorMap, setCurrentErrorMap] = useState<Map<string, number>>(new Map());
  const [incorrectNewlinePosition, setIncorrectNewlinePosition] = useState<number>(-1);
  // Empty lines highlighting state (currently not used)
  // const [emptyLines, setEmptyLines] = useState<Set<number>>(new Set());
  const { addError, getHighErrorChars, showHighErrorChars, toggleHighErrorChars } = useErrorStatsStore();
  const highErrorChars = getHighErrorChars();

  // Check if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const parsed = parseTextWithTranslations(textToPractice);
    setParsedText(parsed);
  }, [textToPractice]);

  const handleSubmit = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true);
      return;
    }

    const wordPerMinute = Math.round(
      userInput.split(" ").length / (timer / 60)
    );
    setWpm(Number.isFinite(wordPerMinute) ? wordPerMinute : 0);

    // Calculate final accuracy
    const finalAccuracy = totalKeystrokes > 0 ? 
      Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100) : 0;
    setAccuracy(Number.isFinite(finalAccuracy) ? finalAccuracy : 0);

    setIsSubmitted(true);
  }, [isStarted, timer, userInput, mistakes, totalKeystrokes]);

  // Create commands
  const commands = useMemo(() => createCommands(handleSubmit), [handleSubmit]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle keyboard events for non-mobile devices
    if (isMobile) return;

    // If there's an incorrect newline and user presses backspace
    if (incorrectNewlinePosition !== -1) {
      if (event.key === 'Backspace') {
        event.preventDefault();
        setUserInput(prev => prev.slice(0, -1));
        setIncorrectNewlinePosition(-1);
        setHasMistake(false);
        setShowMistakeAlert(false);
        return;
      }
      // Prevent any other key presses when there's an incorrect newline
      event.preventDefault();
      setShowMistakeAlert(true);
      setTimeout(() => setShowMistakeAlert(false), 2000);
      return;
    }

    // Handle Escape key first
    if (event.key === "Escape") {
      event.preventDefault();
      if (showCommandPalette) {
        setShowCommandPalette(false);
        setCommandSearch("");
        return;
      }
      // Reset all state
      setUserInput("");
      setTimer(0);
      setIsStarted(false);
      setAccuracy(0);
      setWpm(0);
      setIsSubmitted(false);
      setReload(false);
      setTextToPractice(text);
      setMistakes(0);
      setTotalKeystrokes(0);
      setHasMistake(false);
      setShowMistakeAlert(false);
      setLastCorrectPosition(-1);
      setLastTypedPosition(-1);
      setIncorrectNewlinePosition(-1);
      return;
    }

    // Handle command palette
    if (event.metaKey || event.ctrlKey) {
      if (event.key === "k") {
        event.preventDefault();
        setShowCommandPalette(true);
        return;
      }

      // Handle other command shortcuts
      switch (event.key.toLowerCase()) {
        case "r":
          event.preventDefault();
          window.location.reload();
          return;
        case "enter":
          event.preventDefault();
          handleSubmit();
          return;
        case "t":
          event.preventDefault();
          document.documentElement.classList.toggle("dark");
          return;
        case "i":
          event.preventDefault();
          document.querySelector("textarea")?.focus();
          return;
      }
    }

    if (ignoredKeys.includes(event.key)) {
      // Do nothing for ignored keys
      return;
    }

    if (!isStarted) {
      setIsStarted(true);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      
      // Get the expected character at current position
      let expectedChar = '';
      let currentIndex = 0;
      for (const part of parsedText) {
        if (currentIndex + part.text.length > userInput.length) {
          expectedChar = part.text[userInput.length - currentIndex];
          break;
        }
        currentIndex += part.text.length;
      }
      
      // Check if Enter is expected at this position
      const isExpectedNewline = expectedChar === '\n';
      
      if (isExpectedNewline) {
        // Handle correct newline
        const newInput = userInput + '\n';
        setUserInput(newInput);
        setLastCorrectPosition(newInput.length - 1);
        setLastTypedPosition(newInput.length - 1);
        setTotalKeystrokes(prev => prev + 1);
        setTimeout(() => setLastTypedPosition(-1), 300);
      } else {
        // Handle incorrect newline (treat as a mistake)
        setMistakes(prev => prev + 1);
        setHasMistake(true);
        setShowMistakeAlert(true);
        setIncorrectNewlinePosition(userInput.length);
        
        // Add the newline to show it in the UI
        setUserInput(prev => prev + '\n');
        
        // Update error maps
        setCurrentErrorMap(prev => {
          const newMap = new Map(prev);
          newMap.set('\n', (newMap.get('\n') || 0) + 1);
          return newMap;
        });
        addError('\n');
        setTotalKeystrokes(prev => prev + 1);
      }
      
      return;
    }

    // If there's a mistake and user tries to type more, show alert
    if (hasMistake && event.key !== "Backspace") {
      event.preventDefault();
      // Don't show the alert for incorrect newlines as we already show it
      if (incorrectNewlinePosition === -1) {
        setShowMistakeAlert(true);
        // Hide alert after 2 seconds
        setTimeout(() => setShowMistakeAlert(false), 2000);
      }
      return;
    }

    // Get the expected character from parsedText
    let expectedChar = '';
    let currentIndex = 0;
    for (const part of parsedText) {
      if (currentIndex + part.text.length > userInput.length) {
        expectedChar = part.text[userInput.length - currentIndex];
        break;
      }
      currentIndex += part.text.length;
    }

    // Prevent typing if we're trying to rewrite a correct character
    if (userInput.length <= lastCorrectPosition && event.key !== "Backspace") {
      event.preventDefault();
      return;
    }

    // Handle backspace
    if (event.key === "Backspace") {
      // If we're at the incorrect newline position, handle it in the keydown handler
      if (incorrectNewlinePosition === userInput.length - 1) {
        return; // Let the keydown handler handle this
      }
      
      // Prevent backspacing over correct letters
      if (userInput.length <= lastCorrectPosition + 1) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === "Backspace") {
      setUserInput((prevKeys) => {
        const newInput = prevKeys.slice(0, -1);
        if (hasMistake && newInput.length === userInput.length - 1) {
          setHasMistake(false);
          setShowMistakeAlert(false);
        }
        return newInput;
      });
    } else if (event.key === " ") {
      event.preventDefault();
      setUserInput((prevKeys) => {
        const newInput = prevKeys + event.key;
        if (expectedChar !== event.key) {
          setMistakes(prev => prev + 1);
          setHasMistake(true);
          setShowMistakeAlert(true);
          setTimeout(() => setShowMistakeAlert(false), 2000);
          
          // Update error maps
          setCurrentErrorMap(prev => {
            const newMap = new Map(prev);
            newMap.set(event.key, (newMap.get(event.key) || 0) + 1);
            return newMap;
          });
          addError(event.key);
        } else {
          setLastCorrectPosition(newInput.length - 1);
          setLastTypedPosition(newInput.length - 1);
          setTimeout(() => setLastTypedPosition(-1), 300);
        }
        setTotalKeystrokes(prev => prev + 1);
        return newInput;
      });
    } else {
      setUserInput((prevKeys) => {
        const newInput = prevKeys + event.key;
        if (expectedChar !== event.key) {
          setMistakes(prev => prev + 1);
          setHasMistake(true);
          setShowMistakeAlert(true);
          setTimeout(() => setShowMistakeAlert(false), 2000);
          
          // Update error maps
          setCurrentErrorMap(prev => {
            const newMap = new Map(prev);
            newMap.set(event.key, (newMap.get(event.key) || 0) + 1);
            return newMap;
          });
          addError(event.key);
        } else {
          setLastCorrectPosition(newInput.length - 1);
          setLastTypedPosition(newInput.length - 1);
          setTimeout(() => setLastTypedPosition(-1), 300);
        }
        setTotalKeystrokes(prev => prev + 1);
        return newInput;
      });
    }
  }, [handleSubmit, isMobile, isStarted, showCommandPalette, text, parsedText, hasMistake, userInput, lastCorrectPosition, addError, incorrectNewlinePosition]);

  useEffect(() => {
    // Only attach keyboard event listener for non-mobile devices
    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown, isMobile]); // Add isMobile to dependencies

  useEffect(() => {
    if (reload) {
      setTextToPractice(textToPractice + " " + text);
      setReload(false);
    }
  }, [reload, textToPractice, text]);

  useEffect(() => {
    const isReload = userInput.length === textToPractice.length;
    if (isReload) {
      setReload(true);
    }
  }, [reload, textToPractice.length, userInput.length]);

  useEffect(() => {
    if (isStarted && !isSubmitted) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isStarted, isSubmitted]);

  useEffect(() => {
    if (isStarted && !isSubmitted) {
      const wordPerMinute = Math.round(
        userInput.split(" ").length / (timer / 60)
      );
      const currentWpm = Number.isFinite(wordPerMinute) ? wordPerMinute : 0;
      setWpm(currentWpm);
      
      // Update WPM history
      setWpmHistory(prev => [...prev, currentWpm]);

      // Calculate accuracy based on mistakes and total keystrokes
      const accuracy = totalKeystrokes > 0 ? 
        Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100) : 0;
      setAccuracy(Number.isFinite(accuracy) ? accuracy : 0);
    }
  }, [textToPractice, timer, userInput, isStarted, isSubmitted, mistakes, totalKeystrokes]);

  useEffect(() => {
    if (!(eclipsedTime === 0) && timer === eclipsedTime) {
      handleSubmit();
      setIsSubmitted(true);
    }
  }, [eclipsedTime, handleSubmit, timer]);

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
    <>
      <section className="p-2 flex flex-col gap-3">
        {/* Mistake Alert */}
        {showMistakeAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
            {incorrectNewlinePosition !== -1 
              ? "Press Backspace to remove the incorrect newline" 
              : "Fix the mistake before continuing!"}
          </div>
        )}

        <CommandPalette
          showCommandPalette={showCommandPalette}
          commandSearch={commandSearch}
          onCommandSearchChange={setCommandSearch}
          onCommandSelect={(cmd) => {
            cmd.action();
            setShowCommandPalette(false);
            setCommandSearch("");
          }}
          commands={commands}
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
          <div className="fixed bottom-0 left-0 right-0 bg-base-100 dark:bg-gray-800 border-t dark:border-gray-700 p-2 z-50">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
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
            className="input input-bordered w-full"
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
    </>
  );
}
