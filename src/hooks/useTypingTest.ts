import { useState, useCallback, useEffect } from 'react';
import { useErrorStatsStore } from '../store/errorStatsStore';

interface TextWithTranslation {
  text: string;
  translation?: string;
}

export function useTypingTest(text: string, eclipsedTime?: number) {
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [wpm, setWpm] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reload, setReload] = useState(false);
  const [textToPractice, setTextToPractice] = useState(text);
  const [parsedText, setParsedText] = useState<TextWithTranslation[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [hasMistake, setHasMistake] = useState(false);
  const [showMistakeAlert, setShowMistakeAlert] = useState(false);
  const [lastCorrectPosition, setLastCorrectPosition] = useState<number>(-1);
  const [lastTypedPosition, setLastTypedPosition] = useState<number>(-1);
  const [currentErrorMap, setCurrentErrorMap] = useState<Map<string, number>>(new Map());
  const [incorrectNewlinePosition, setIncorrectNewlinePosition] = useState<number>(-1);
  const { addError, getHighErrorChars, showHighErrorChars, toggleHighErrorChars } = useErrorStatsStore();
  const highErrorChars = getHighErrorChars();

  // Parse text with translations
  const parseTextWithTranslations = useCallback((text: string): TextWithTranslation[] => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: TextWithTranslation[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index) });
      }
      parts.push({
        text: match[1],
        translation: match[2]
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex) });
    }

    return parts;
  }, []);

  useEffect(() => {
    const parsed = parseTextWithTranslations(textToPractice);
    setParsedText(parsed);
  }, [textToPractice, parseTextWithTranslations]);

  const handleSubmit = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true);
      return;
    }

    const wordPerMinute = Math.round(
      userInput.split(" ").length / (timer / 60)
    );
    setWpm(Number.isFinite(wordPerMinute) ? wordPerMinute : 0);

    const finalAccuracy = totalKeystrokes > 0 ? 
      Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100) : 0;
    setAccuracy(Number.isFinite(finalAccuracy) ? finalAccuracy : 0);

    setIsSubmitted(true);
  }, [isStarted, timer, userInput, mistakes, totalKeystrokes]);

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
      
      setWpmHistory(prev => [...prev, currentWpm]);

      const accuracy = totalKeystrokes > 0 ? 
        Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100) : 0;
      setAccuracy(Number.isFinite(accuracy) ? accuracy : 0);
    }
  }, [textToPractice, timer, userInput, isStarted, isSubmitted, mistakes, totalKeystrokes]);

  useEffect(() => {
    if (!(eclipsedTime === 0) && eclipsedTime && timer === eclipsedTime) {
      handleSubmit();
      setIsSubmitted(true);
    }
  }, [eclipsedTime, handleSubmit, timer]);

  const resetTest = useCallback(() => {
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
  }, [text]);

  return {
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
    totalKeystrokes,
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
  };
} 