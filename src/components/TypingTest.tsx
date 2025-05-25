import { useCallback, useEffect, useState } from "react";
import Result from "./Result";

import calculateAccuracy from "../lib/compare";
import { ignoredKeys } from "../lib/utils";

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reload, setReload] = useState(false);
  const [textToPractice, setTextToPractice] = useState(text);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (ignoredKeys.includes(event.key)) {
      // Do nothing for ignored keys
      return;
    }

    if (!isStarted) {
      setIsStarted(true);
    }

    if (event.key === "Backspace") {
      setUserInput((prevKeys) => prevKeys.slice(0, -1)); // Remove the last character
    } else if (event.key === " ") {
      event.preventDefault(); // Prevent the default action of space
      setUserInput((prevKeys) => prevKeys + event.key); // Append to user input
    } else {
      setUserInput((prevKeys) => prevKeys + event.key); // Append to user input
    }
  };

  useEffect(() => {
    // Attach event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setWpm(Number.isFinite(wordPerMinute) ? wordPerMinute : 0);

      const slicedText =
        userInput.length <= textToPractice.length
          ? textToPractice.slice(0, userInput.length)
          : textToPractice;
      const accuracy = calculateAccuracy(slicedText, userInput);
      setAccuracy(Number.isFinite(parseInt(accuracy)) ? parseInt(accuracy) : 0);
    }
  }, [textToPractice, timer, userInput, isStarted, isSubmitted]);

  const handleSubmit = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true);
      return;
    }

    const wordPerMinute = Math.round(
      userInput.split(" ").length / (timer / 60)
    );
    setWpm(Number.isFinite(wordPerMinute) ? wordPerMinute : 0);

    const slicedText =
      userInput.length <= textToPractice.length
        ? textToPractice.slice(0, userInput.length)
        : textToPractice;
    const accuracy = calculateAccuracy(slicedText, userInput);
    setAccuracy(Number.isFinite(parseInt(accuracy)) ? parseInt(accuracy) : 0);

    setIsSubmitted(true);
  }, [isStarted, textToPractice, timer, userInput]);

  useEffect(() => {
    if (!(eclipsedTime === 0) && timer === eclipsedTime) {
      handleSubmit();
      setIsSubmitted(true);
    }
  }, [eclipsedTime, handleSubmit, timer]);

  if (isSubmitted) {
    return <Result wpm={wpm} accuracy={accuracy} />;
  }

  return (
    <>
      <section className="p-2 flex flex-col gap-3">
        {eclipsedTime !== Infinity && (
          <progress
            className="progress progress-success w-full"
            value={timer}
            max={eclipsedTime}
          ></progress>
        )}
        <div className="p-2 border dark:border-gray-700 rounded md:text-3xl select-none flex flex-wrap gap-y-2 w-full relative">
          {/* Display a guidance message when not started */}
          {!isStarted && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-base-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded z-10">
              <p className="text-lg text-center text-success font-medium">
                Start typing to begin the test
                <span className="block mt-2 animate-bounce">⌨️</span>
              </p>
            </div>
          )}
          
          {/* Calculate current word index */}
          {(() => {
            const currentIndex = userInput.length;
            const text = textToPractice.split("");
            
            // Find word boundaries
            const wordBoundaries: number[] = [];
            text.forEach((char, index) => {
              if (char === " " || index === 0) {
                wordBoundaries.push(index === 0 ? 0 : index + 1);
              }
            });
            
            // Determine current word
            let currentWordStart = 0;
            let currentWordEnd = text.length - 1;
            
            for (let i = 0; i < wordBoundaries.length; i++) {
              if (currentIndex >= wordBoundaries[i]) {
                currentWordStart = wordBoundaries[i];
                currentWordEnd = i < wordBoundaries.length - 1 ? 
                  wordBoundaries[i + 1] - 2 : // -2 to account for space and indexing
                  text.length - 1;
              }
            }
            
            return text.map((char, charIndex) => {
              const isSpace = char === " ";
              const userChar = userInput[charIndex];
              const isCorrect = userChar === char;
              const isIncorrect = userChar && !isCorrect;
              const isCurrent = charIndex === currentIndex;
              const isCurrentWord = charIndex >= currentWordStart && charIndex <= currentWordEnd;
              
              return (
                <span
                  key={charIndex}
                  className={`
                    mx-[0.5px] 
                    border-b 
                    ${isCurrent ? 'border-b-success border-b-2 animate-pulse' : 'border-b-base-300 dark:border-gray-600'} 
                    ${isCurrentWord ? 'bg-blue-100/50 dark:bg-blue-900/40 ring-1 ring-blue-300 dark:ring-blue-700' : ''}
                    p-[1px] rounded w-[27px] text-center 
                    ${isCorrect ? "text-green-500 bg-green-100 dark:bg-green-900/40 dark:text-green-300" : 
                      isIncorrect ? "text-red-500 bg-red-100 dark:bg-red-900/40 dark:text-red-300" : 
                      isCurrent ? "bg-success/10 font-bold ring-1 ring-success ring-opacity-50" : ""
                    }
                    ${isCurrent ? 'relative' : ''}
                  `}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  {/* Current character indicator */}
                  {isCurrent && (
                    <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs bg-success text-white px-2 py-1 rounded">
                      Type
                    </span>
                  )}
                  {isSpace ? "\u00A0" : char} {/* Render non-breaking space */}
                </span>
              );
            });
          })()}
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
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={handleSubmit}
            className="btn btn-success flex-1 transition-all duration-300 hover:scale-105"
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
