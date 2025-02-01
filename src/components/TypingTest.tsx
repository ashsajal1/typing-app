import { useCallback, useEffect, useState } from "react";
import Timer from "./Timer";
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
        <div className="p-2 border dark:border-gray-700 rounded md:text-3xl select-none flex flex-wrap gap-y-2 w-full">
          {textToPractice.split("").map((char, charIndex) => {
            const isSpace = char === " ";
            const userChar = userInput[charIndex];
            const isCorrect = userChar === char;
            const isIncorrect = userChar && !isCorrect;

            return (
              <span
                key={charIndex}
                className={`mx-[0.5px] border-b border-b-base-300 p-[1px] rounded w-[27px] text-center ${
                  isCorrect
                    ? "text-green-500 bg-green-100"
                    : isIncorrect
                      ? "text-red-500 bg-red-100"
                      : ""
                }`}
              >
                {isSpace ? "\u00A0" : char} {/* Render non-breaking space */}
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full">
          <Timer time={timer} />
          <div className="p-2 w-full rounded border-success border text-success">
            <p>
              Accuracy : <span>{accuracy}%</span>
            </p>
          </div>
          <div className="p-2 w-full rounded border-success border text-success">
            <p>
              WPM : <span>{wpm}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            window.location.reload();
          }}
          className="btn btn-outline btn-success"
        >
          {"Reset"}
        </button>
      </section>
    </>
  );
}
