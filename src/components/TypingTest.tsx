import { useCallback, useEffect, useState } from "react";
import Timer from "./Timer";
import Result from "./Result";
import calculateAccuracy from "../lib/compare";
import { ignoredKeys } from "../lib/utils";

// Basic keywords for highlighting (can be expanded)
const pythonKeywords = ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'try', 'except', 'finally', 'with', 'as', 'True', 'False', 'None', 'print'];
const cppKeywords = ['int', 'float', 'double', 'char', 'bool', 'void', 'class', 'struct', 'return', 'if', 'else', 'for', 'while', 'include', 'namespace', 'using', 'true', 'false', 'nullptr', 'cout', 'cin', 'std'];

// Helper function to get syntax class
const getSyntaxClass = (word: string, language?: string): string => {
  if (language === 'python') {
    if (pythonKeywords.includes(word)) return 'text-blue-500 dark:text-blue-400'; // Keyword
    if (word.startsWith('#')) return 'text-gray-500 dark:text-gray-400'; // Comment
    if ((word.startsWith("'") && word.endsWith("'")) || (word.startsWith('"') && word.endsWith('"'))) return 'text-green-600 dark:text-green-400'; // String
  } else if (language === 'cpp') {
    if (cppKeywords.includes(word)) return 'text-blue-500 dark:text-blue-400'; // Keyword
    if (word.startsWith('//') || word.startsWith('/*')) return 'text-gray-500 dark:text-gray-400'; // Comment
    if ((word.startsWith("'") && word.endsWith("'")) || (word.startsWith('"') && word.endsWith('"'))) return 'text-green-600 dark:text-green-400'; // String
  }
  return ''; // Default
};


export default function TypingTest({
  text,
  eclipsedTime,
  language,
}: {
  text: string;
  eclipsedTime: number;
  language?: "python" | "cpp" | "plaintext" | string;
}) {
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [cpm, setCpm] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [textToPractice, setTextToPractice] = useState(text);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (ignoredKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!isStarted) {
      setIsStarted(true);
    }

    if (event.key === "Enter") {
        setUserInput((prevKeys) => prevKeys + "\n");
        event.preventDefault();
        return;
    }

    if (event.key === "Tab") {
        setUserInput((prevKeys) => prevKeys + "\t");
        event.preventDefault();
        return;
    }

    if (event.key === "Backspace") {
      setUserInput((prevKeys) => prevKeys.slice(0, -1));
    } else if (event.key.length === 1) {
      setUserInput((prevKeys) => prevKeys + event.key);
    }
  };

  useEffect(() => {
    setTextToPractice(text);
    setUserInput("");
    setTimer(0);
    setIsStarted(false);
    setIsSubmitted(false);
  }, [text, language]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStarted, handleKeyDown]); // Added handleKeyDown to dependency array

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
      const charactersTyped = userInput.length;
      const minutes = timer / 60;
      const currentCpm = minutes > 0 ? Math.round(charactersTyped / minutes) : 0;

      setCpm(Number.isFinite(currentCpm) ? currentCpm : 0);

      const comparisonLength = Math.min(textToPractice.length, userInput.length);
      const textSlice = textToPractice.slice(0, comparisonLength);
      const userInputSlice = userInput.slice(0, comparisonLength);

      const currentAccuracy = calculateAccuracy(textSlice, userInputSlice);
      setAccuracy(Number.isFinite(parseInt(currentAccuracy)) ? parseInt(currentAccuracy) : 0);
    }
  }, [textToPractice, timer, userInput, isStarted, isSubmitted]);


  const handleSubmit = useCallback(() => {
    if (!isStarted && userInput.length === 0) return;
    setIsSubmitted(true);
  }, [isStarted, userInput]);

  useEffect(() => {
    if (!(eclipsedTime === 0 || eclipsedTime === Infinity) && timer >= eclipsedTime) {
      if (!isSubmitted) handleSubmit();
    }
  }, [eclipsedTime, handleSubmit, timer, isSubmitted]);


  if (isSubmitted) {
    // Pass originalText and userInput to the Result component
    return <Result cpm={cpm} accuracy={accuracy} originalText={textToPractice} userInput={userInput} />;
  }

  const lines = textToPractice.split('\n');

  return (
    <>
      <section className="p-2 flex flex-col gap-3">
        {eclipsedTime !== Infinity && eclipsedTime > 0 && (
          <progress
            className="progress progress-success w-full"
            value={timer}
            max={eclipsedTime}
          ></progress>
        )}
        <div className="p-4 border dark:border-gray-700 rounded md:text-lg select-none font-mono" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="flex flex-wrap">
              {line.split("").map((char, charIndexInLine) => {
                const overallCharIndex = lines.slice(0, lineIndex).reduce((sum, l) => sum + l.length + 1, 0) + charIndexInLine;
                const userChar = userInput[overallCharIndex];
                const isCorrect = userChar === char;
                const isIncorrect = userChar !== undefined && userChar !== char;

                let currentWord = "";
                if (char.match(/\w/)) {
                    let tempIndex = overallCharIndex;
                    while(tempIndex >= 0 && textToPractice[tempIndex] && textToPractice[tempIndex].match(/\w/)) {
                        currentWord = textToPractice[tempIndex] + currentWord;
                        tempIndex--;
                    }
                    tempIndex = overallCharIndex + 1;
                     while(tempIndex < textToPractice.length && textToPractice[tempIndex] && textToPractice[tempIndex].match(/\w/)) {
                        currentWord += textToPractice[tempIndex];
                        tempIndex++;
                    }
                }
                let inComment = false;
                // Simplified comment/string detection
                if (language === 'python' && textToPractice.substring(0, overallCharIndex).includes('#')) {
                    if (textToPractice.lastIndexOf('\n', overallCharIndex) < textToPractice.lastIndexOf('#', overallCharIndex) )
                    inComment = true;
                }
                // Add more sophisticated logic for C++ comments and strings if needed.

                let charSyntaxClass = '';
                if (inComment) {
                    charSyntaxClass = 'text-gray-500 dark:text-gray-400';
                }
                // Removed inString as it was incomplete and might cause issues without full context parsing
                else {
                    charSyntaxClass = getSyntaxClass(currentWord, language);
                }


                return (
                  <span
                    key={`${lineIndex}-${charIndexInLine}`}
                    className={`
                      ${charSyntaxClass}
                      ${isCorrect ? "text-emerald-500 bg-emerald-100 dark:bg-emerald-800 dark:text-emerald-300" : ""}
                      ${isIncorrect ? "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-300" : ""}
                      ${userInput.length === overallCharIndex ? "border-b-2 border-blue-500 animate-pulse" : ""}
                      ${char === '\t' ? "inline-block w-[4ch]" : ""}
                    `}
                  >
                    {char === " " ? "\u00A0" : (char === "\t" ? "\u00A0\u00A0\u00A0\u00A0" : char) }
                  </span>
                );
              })}
              {line.length === 0 && <span className="min-h-[1em] inline-block w-full"></span>}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full">
          <Timer time={timer} />
          <div className="p-2 w-full rounded border-success border text-success">
            Précision : <span>{accuracy}%</span>
          </div>
          <div className="p-2 w-full rounded border-success border text-success">
            CPM : <span>{cpm}</span>
          </div>
        </div>

        <button onClick={handleSubmit} className="btn btn-success mt-2">
          Soumettre / Terminer
        </button>
        <button onClick={() => window.location.reload()} className="btn btn-outline btn-accent mt-2">
          Réinitialiser l'entraînement
        </button>
      </section>
    </>
  );
}