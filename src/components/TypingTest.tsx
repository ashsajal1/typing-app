import { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
    // const [topics, setTopics] = useState([]);

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
            const wordPerMinute = Math.round(userInput.split(' ').length / (timer / 60));
            setWpm(Number.isFinite(wordPerMinute) ? wordPerMinute : 0);

            const slicedText = userInput.length <= text.length ? text.slice(0, userInput.length) : text;
            const accuracy = calculateAccuracy(slicedText, userInput);
            setAccuracy(Number.isFinite(parseInt(accuracy)) ? parseInt(accuracy) : 0);
        }
    }, [text, timer, userInput, isStarted, isSubmitted]);

    const handleSubmit = useCallback(() => {
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
    }, [isStarted, text, timer, userInput]);

    useEffect(() => {
        if (timer === 60) {
            handleSubmit();
            setIsSubmitted(true);
        }
    }, [handleSubmit, timer]);

    useEffect(() => {
        if (!text) {
            const randomWordString: string = generateRandomWords();
            setText(randomWordString);
        }
    }, [text]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
    };

    const renderLetter = (index: number) => {
        const letter = text[index];
        const enteredLetter = userInput[index];

        if (enteredLetter === undefined) {
            // Letter not yet entered
            return <span key={index}>{letter}</span>;
        } else if (letter === enteredLetter) {
            // Correctly entered letter
            return <span key={index} className="text-green-500 md:text-2xl">{letter}</span>;
        } else {
            // Incorrectly entered letter
            return <span key={index} className="text-red-500 md:text-2xl">{letter}</span>;
        }
    };

    if (isSubmitted) {
        return <Result wpm={wpm} accuracy={accuracy} />;
    }

    return (
        <>
            <section className="p-2 flex flex-col gap-3">

                <p className="p-2 border dark:border-gray-700 rounded md:text-2xl select-none">
                    {text.split('').map((_, index) => renderLetter(index))}
                </p>
                <div className='flex items-center gap-2 w-full'>
                    <Timer time={timer} />
                    <div className='p-2 w-full rounded border-success border text-success'>
                        <p>Accuracy : <span>{accuracy}%</span></p>
                    </div>
                    <div className='p-2 w-full rounded border-success border text-success'>
                        <p>WPM : <span>{wpm}</span></p>
                    </div>
                </div>
                <textarea
                    disabled={!isStarted}
                    onChange={handleInputChange}
                    className="p-2 textarea rounded textarea-bordered text-lg md:text-2xl"
                    title="Text area"
                />

                <button
                    onClick={handleSubmit}
                    className="btn btn-active btn-success"
                >
                    {isStarted ? 'Submit' : 'Start'}
                </button>
                <button
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="btn btn-outline btn-success"
                >
                    {'Reset'}
                </button>
            </section>
        </>
    );
}
