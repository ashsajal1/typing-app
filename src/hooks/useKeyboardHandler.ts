import { useCallback, useEffect } from 'react';
import { ignoredKeys } from '../lib/utils';

interface KeyboardHandlerProps {
  isMobile: boolean;
  isStarted: boolean;
  setIsStarted: (started: boolean) => void;
  showCommandPalette: boolean;
  setShowCommandPalette: (show: boolean) => void;
  setCommandSearch: (search: string) => void;
  handleSubmit: () => void;
  parsedText: Array<{ text: string; translation?: string }>;
  hasMistake: boolean;
  userInput: string;
  lastCorrectPosition: number;
  incorrectNewlinePosition: number;
  setUserInput: (input: string | ((prev: string) => string)) => void;
  setMistakes: (mistakes: number | ((prev: number) => number)) => void;
  setHasMistake: (hasMistake: boolean) => void;
  setShowMistakeAlert: (show: boolean) => void;
  setIncorrectNewlinePosition: (position: number) => void;
  setLastCorrectPosition: (position: number) => void;
  setLastTypedPosition: (position: number) => void;
  setTotalKeystrokes: (keystrokes: number | ((prev: number) => number)) => void;
  setCurrentErrorMap: (map: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>)) => void;
  addError: (key: string) => void;
  resetTest: () => void;
}

export function useKeyboardHandler({
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
}: KeyboardHandlerProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isMobile) return;

    if (incorrectNewlinePosition !== -1) {
      if (event.key === 'Backspace') {
        event.preventDefault();
        setUserInput(prev => prev.slice(0, -1));
        setIncorrectNewlinePosition(-1);
        setHasMistake(false);
        setShowMistakeAlert(false);
        return;
      }
      event.preventDefault();
      setShowMistakeAlert(true);
      setTimeout(() => setShowMistakeAlert(false), 2000);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      if (showCommandPalette) {
        setShowCommandPalette(false);
        setCommandSearch("");
        return;
      }
      resetTest();
      return;
    }

    if (event.metaKey || event.ctrlKey) {
      if (event.key === "k") {
        event.preventDefault();
        setShowCommandPalette(true);
        return;
      }

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

    if (ignoredKeys.includes(event.key)) return;

    if (!isStarted) {
      setIsStarted(true);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      
      let expectedChar = '';
      let currentIndex = 0;
      for (const part of parsedText) {
        if (currentIndex + part.text.length > userInput.length) {
          expectedChar = part.text[userInput.length - currentIndex];
          break;
        }
        currentIndex += part.text.length;
      }
      
      const isExpectedNewline = expectedChar === '\n';
      
      if (isExpectedNewline) {
        const newInput = userInput + '\n';
        setUserInput(newInput);
        setLastCorrectPosition(newInput.length - 1);
        setLastTypedPosition(newInput.length - 1);
        setTotalKeystrokes(prev => prev + 1);
        setTimeout(() => setLastTypedPosition(-1), 300);
      } else {
        setMistakes(prev => prev + 1);
        setHasMistake(true);
        setShowMistakeAlert(true);
        setIncorrectNewlinePosition(userInput.length);
        setUserInput(prev => prev + '\n');
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

    if (hasMistake && event.key !== "Backspace") {
      event.preventDefault();
      if (incorrectNewlinePosition === -1) {
        setShowMistakeAlert(true);
        setTimeout(() => setShowMistakeAlert(false), 2000);
      }
      return;
    }

    let expectedChar = '';
    let currentIndex = 0;
    for (const part of parsedText) {
      if (currentIndex + part.text.length > userInput.length) {
        expectedChar = part.text[userInput.length - currentIndex];
        break;
      }
      currentIndex += part.text.length;
    }

    if (userInput.length <= lastCorrectPosition && event.key !== "Backspace") {
      event.preventDefault();
      return;
    }

    if (event.key === "Backspace") {
      if (incorrectNewlinePosition === userInput.length - 1) {
        return;
      }
      
      if (userInput.length <= lastCorrectPosition + 1) {
        event.preventDefault();
        return;
      }

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
  }, [
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
  ]);

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown, isMobile]);

  return handleKeyDown;
} 