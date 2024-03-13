import { ChangeEvent, useEffect, useState } from 'react';
import Timer from './Timer';
import Result from './Result';
import generateRandomWords from '../lib/generateRandomWords';
import calculateAccuracy from '../lib/compare';

export default function TypingTest() {
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timer, setTimer] = useState<number>(0);
    const [isStarted, setIsStarted] = useState(false);
    const [accuracy, setAccuracy] = useState<number>(0);
    const [wpm, setWpm] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isStarted) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isStarted]);

    useEffect(() => {
        if (timer === 60) {
            handleSubmit();
            setIsSubmitted(true);
        }
    }, [timer]);

    useEffect(() => {
        if (!text) {
            const randomWordString: string = generateRandomWords();
            setText(randomWordString);
        }
    }, [text]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = () => {
        if (!isStarted) {
            setIsStarted(true);
            return;
        }

        const wordPerMinute = Math.round(userInput.split(' ').length / (timer / 60));
        setWpm(Number.isFinite(wordPerMinute) ? wordPerMinute : 0);

        const slicedText = userInput.length <= text.length ? text.slice(0, userInput.length) : text;
        const accuracy = calculateAccuracy(slicedText, userInput);
        setAccuracy(Number.isFinite(parseInt(accuracy)) ? parseInt(accuracy) : 0);

        setIsSubmitted(true);
    };

    const renderLetter = (index: number) => {
        const letter = text[index];
        const enteredLetter = userInput[index];

        if (enteredLetter === undefined) {
            // Letter not yet entered
            return <span key={index}>{letter}</span>;
        } else if (letter === enteredLetter) {
            // Correctly entered letter
            return <span key={index} className="text-green-500">{letter}</span>;
        } else {
            // Incorrectly entered letter
            return <span key={index} className="text-red-500">{letter}</span>;
        }
    };

    if (isSubmitted) {
        return <Result wpm={wpm} accuracy={accuracy} />;
    }

    return (
        <>
            <section className="p-2 flex flex-col gap-3">
                <Timer time={timer} />
                <p className="p-2 border rounded text-4xl font-medium">
                    {text.split('').map((_, index) => renderLetter(index))}
                </p>
                <textarea
                    disabled={!isStarted}
                    onChange={handleInputChange}
                    className="p-2 rounded border outline-none text-lg"
                    title="Text area"
                />

                <button
                    onClick={handleSubmit}
                    className="p-2 text-sm font-mono border rounded bg-teal-700 hover:bg-teal-800 text-slate-50"
                >
                    {isStarted ? 'Submit' : 'Start'}
                </button>
            </section>
        </>
    );
}