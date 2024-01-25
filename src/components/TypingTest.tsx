import { ChangeEvent, useEffect, useState } from "react"
import Timer from "./Timer";
import calculateAccuracy from "../lib/compare";
import Result from "./Result";
import generateRandomWords from "../lib/genrerateRandomWords";

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
        if (timer === 5) {
            handleSubmit()
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
        // console.log(e.target.value);
    }

    const handleSubmit = () => {
        // console.log("submitted")
        if (!isStarted) {
            setIsStarted(true);
            return
        }

        const wordPerMinute = Math.round(userInput.split(' ').length / (timer / 60));
        setWpm(wordPerMinute);

        // console.log(userInput)
        const accuracy = calculateAccuracy(text, userInput);
        setAccuracy(parseInt(accuracy))
        // console.log(typeof(parseInt(accuracy))) 
        setIsSubmitted(true);

    }

    if (isSubmitted) {
        return (
            <>
                <Result wpm={wpm} accuracy={accuracy} />
            </>
        );
    }

    return (
        <>
            <section className="p-2 flex flex-col gap-3">
                <Timer time={timer} />
                <p className="p-2 border runded text-lg font-medium">{text}</p>
                <input disabled={!isStarted} onChange={handleInputChange} className="p-2 rounded border outline-none" title="Text field" type="text" />

                <button onClick={handleSubmit} className="p-2 text-sm font-mono border rounded bg-teal-700 hover:bg-teal-800 text-slate-50">{isStarted ? "Submit" : "Start"}</button>
            </section>
        </>
    )
}
