import { useCallback, useEffect, useState } from "react";
import Result from "./Result";
import { useErrorStatsStore } from '../store/errorStatsStore';

import { ignoredKeys } from "../lib/utils";

// Command interface
interface Command {
  id: string;
  name: string;
  shortcut: string;
  action: () => void;
  description: string;
}

// Interface for text with translations
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
  const { addError, getHighErrorChars } = useErrorStatsStore();
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
    setParsedText(parseTextWithTranslations(textToPractice));
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

  // Define available commands
  const commands: Command[] = [
    {
      id: "restart",
      name: "Restart Test",
      shortcut: "⌘R",
      action: () => window.location.reload(),
      description: "Start a new typing test"
    },
    {
      id: "finish",
      name: "Finish Test",
      shortcut: "⌘Enter",
      action: handleSubmit,
      description: "End the current test and view results"
    },
    {
      id: "toggle-theme",
      name: "Toggle Theme",
      shortcut: "⌘T",
      action: () => document.documentElement.classList.toggle("dark"),
      description: "Switch between light and dark mode"
    },
    {
      id: "focus-input",
      name: "Focus Input",
      shortcut: "⌘I",
      action: () => document.querySelector("textarea")?.focus(),
      description: "Focus on the typing area"
    }
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.description.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle keyboard events for non-mobile devices
    if (isMobile) return;

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
      handleSubmit();
      return;
    }

    // If there's a mistake and user tries to type more, show alert
    if (hasMistake && event.key !== "Backspace") {
      event.preventDefault();
      setShowMistakeAlert(true);
      // Hide alert after 2 seconds
      setTimeout(() => setShowMistakeAlert(false), 2000);
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

    // Prevent backspacing over correct letters
    if (event.key === "Backspace" && userInput.length <= lastCorrectPosition + 1) {
      event.preventDefault();
      return;
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
  }, [handleSubmit, isMobile, isStarted, showCommandPalette, text, parsedText, hasMistake, userInput.length, lastCorrectPosition, addError]);

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
            Fix the mistake before continuing!
          </div>
        )}

        {/* Command Palette */}
        {showCommandPalette && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
            <div className="bg-base-100 dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search commands..."
                  className="input input-bordered w-full"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  autoFocus
                />
                <kbd className="kbd kbd-sm">⌘K</kbd>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setShowCommandPalette(false);
                      setCommandSearch("");
                    }}
                    className="w-full text-left p-2 hover:bg-base-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium">{cmd.name}</div>
                      <div className="text-sm text-base-content/70">{cmd.description}</div>
                    </div>
                    <kbd className="kbd kbd-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {cmd.shortcut}
                    </kbd>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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
                onChange={(e) => {
                  if (!isStarted) {
                    setIsStarted(true);
                  }

                  // If there's a mistake and user tries to type more, prevent it
                  if (hasMistake) {
                    e.preventDefault();
                    setShowMistakeAlert(true);
                    setTimeout(() => setShowMistakeAlert(false), 2000);
                    return;
                  }

                  const newInput = e.target.value;
                  
                  // Prevent typing if we're trying to rewrite a correct character
                  if (newInput.length <= lastCorrectPosition + 1) {
                    setUserInput(newInput);
                    return;
                  }

                  // Calculate accuracy for mobile
                  const expectedChar = parsedText.reduce((acc, part) => {
                    if (acc.length >= newInput.length) return acc;
                    return acc + part.text;
                  }, "")[newInput.length - 1];

                  const currentChar = newInput[newInput.length - 1];
                  if (currentChar && expectedChar && currentChar !== expectedChar) {
                    setMistakes(prev => prev + 1);
                    setHasMistake(true);
                    setShowMistakeAlert(true);
                    setTimeout(() => setShowMistakeAlert(false), 2000);
                    // Update input to show the wrong character
                    setUserInput(newInput);
                    return;
                  } else if (currentChar && expectedChar && currentChar === expectedChar) {
                    setLastCorrectPosition(newInput.length - 1);
                    setUserInput(newInput);
                  }
                  setTotalKeystrokes(prev => prev + 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                  // Handle backspace for mobile
                  if (e.key === 'Backspace') {
                    e.preventDefault();
                    setUserInput(prev => {
                      const newInput = prev.slice(0, -1);
                      // If we're backspacing the mistake, reset the mistake state
                      if (hasMistake && newInput.length === prev.length - 1) {
                        setHasMistake(false);
                        setShowMistakeAlert(false);
                      }
                      // Prevent backspacing over correct letters
                      if (newInput.length <= lastCorrectPosition) {
                        return prev;
                      }
                      return newInput;
                    });
                  }
                }}
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

        <div className="h-[300px] overflow-y-auto relative border dark:border-gray-700 rounded" style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}>
          <div className="p-2 md:text-2xl select-none flex flex-wrap gap-y-2 w-full relative [&::-webkit-scrollbar]:hidden">
            {/* Display a guidance message when not started */}
            {!isStarted && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-base-100/60 dark:bg-gray-900/70 backdrop-blur-[1px] rounded z-10">
                <div className="text-center space-y-4 mt-12">
                  <p className="text-2xl text-success font-medium">
                    Start typing to begin the test
                  </p>
                  <div className="flex items-center justify-center gap-2 text-base-content/70">
                    <kbd className="kbd kbd-sm">⌨️</kbd>
                    <span>Press any key to start</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-base-content/60">
                    <div className="flex items-center gap-1">
                      <kbd className="kbd kbd-xs">Esc</kbd>
                      <span>Reset</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="kbd kbd-xs">Enter</kbd>
                      <span>Finish</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Calculate current word index */}
            {(() => {
              const currentIndex = userInput.length;
              let charIndex = 0;
              
              // Find word boundaries
              const wordBoundaries: number[] = [];
              let tempCharIndex = 0;
              parsedText.forEach(part => {
                const chars = part.text.split("");
                chars.forEach((char) => {
                  if (char === " " || tempCharIndex === 0) {
                    wordBoundaries.push(tempCharIndex === 0 ? 0 : tempCharIndex + 1);
                  }
                  tempCharIndex++;
                });
              });
              
              // Determine current word
              let currentWordStart = 0;
              let currentWordEnd = charIndex - 1;
              
              for (let i = 0; i < wordBoundaries.length; i++) {
                if (currentIndex >= wordBoundaries[i]) {
                  currentWordStart = wordBoundaries[i];
                  currentWordEnd = i < wordBoundaries.length - 1 ? 
                    wordBoundaries[i + 1] - 2 : // -2 to account for space and indexing
                    tempCharIndex - 1;
                }
              }
              
              return parsedText.map((part, partIndex) => {
                const chars = part.text.split("");
                return chars.map((char, charInPartIndex) => {
                  const isSpace = char === " ";
                  const userChar = userInput[charIndex];
                  const isCorrect = userChar === char;
                  const isIncorrect = userChar && !isCorrect;
                  const isCurrent = charIndex === currentIndex;
                  const isCurrentWord = charIndex >= currentWordStart && charIndex <= currentWordEnd;
                  const isHighErrorChar = highErrorChars.includes(char);
                  const isTyped = charIndex < userInput.length;
                  
                  const element = (
                    <span
                      key={`${partIndex}-${charInPartIndex}`}
                      className={`
                        mx-[0.5px] 
                        border-b 
                        ${isCurrent ? 'border-b-success border-b-2' : 'border-b-base-300 dark:border-gray-600'} 
                        ${isCurrentWord ? 'bg-blue-100/50 dark:bg-blue-900/40 ring-1 ring-blue-300 dark:ring-blue-700' : ''}
                        p-[1px] rounded w-[27px] text-center 
                        ${isTyped ? (
                          isCorrect ? "text-green-500 bg-green-100 dark:bg-green-900/40 dark:text-green-300" : 
                          isIncorrect ? "text-red-500 bg-red-100 dark:bg-red-900/40 dark:text-red-300" : ""
                        ) : (
                          isHighErrorChar ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" : ""
                        )}
                        ${isCurrent ? "bg-success/10 font-bold ring-1 ring-success ring-opacity-50" : ""}
                        ${charIndex === lastTypedPosition ? 'animate-typing' : ''}
                        ${isCurrent ? 'relative' : ''}
                      `}
                      aria-current={isCurrent ? "true" : undefined}
                      ref={(el) => {
                        if (isCurrent && el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                    >
                      {/* Current character indicator */}
                      {isCurrent && (
                        <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs bg-success text-white px-2 py-1 rounded">
                          Type
                        </span>
                      )}
                      {/* Translation tooltip */}
                      {part.translation && isCurrentWord && (
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded whitespace-nowrap">
                          {part.translation}
                        </span>
                      )}
                      {isSpace ? "\u00A0" : char}
                    </span>
                  );
                  
                  charIndex++;
                  return element;
                });
              });
            })()}
          </div>
        </div>

        <div className="stats shadow w-full bg-base-100 dark:bg-gray-800 rounded-lg border border-success/20">
          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Time</div>
            <div className="stat-value text-success">{timer}s</div>
            {eclipsedTime !== Infinity && <div className="stat-desc">of {eclipsedTime}s total</div>}
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Accuracy</div>
            <div className="stat-value text-success">{accuracy}%</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="stat-title">WPM</div>
            <div className="stat-value text-success">{wpm}</div>
            <div className="stat-desc">Words per minute</div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="btn btn-outline btn-success flex-1 group transition-all duration-300 hover:scale-105"
            title="Press Esc to reset"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={handleSubmit}
            className="btn btn-success flex-1 transition-all duration-300 hover:scale-105"
            title="Press Enter to finish"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Finish
          </button>
        </div>
      </section>
    </>
  );
}
