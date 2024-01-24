import { ChangeEvent, useEffect, useState } from "react"
import Timer from "./Timer";

export default function TypingTest() {
    const [text, setText] = useState('This is the text to write and test.');
    const [userInput, setUserInput] = useState('');
    const [timer, setTimer] = useState<number>(0);
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        if (isStarted) {
          const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
          }, 1000);
    
          return () => clearInterval(interval);
        }
      }, [isStarted]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
        // console.log(e.target.value);
    }

    const handleSubmit = () => {
        // console.log("submitted")
    }

    return (
        <>
            <section className="p-2 flex flex-col gap-3">
                <Timer time={timer} />
                <p className="p-2 border runded text-lg font-medium">{text}</p>
                <input onChange={handleInputChange} className="p-2 rounded border outline-none" title="Text field" type="text" />

                <button onClick={handleSubmit} className="p-1 font-mono border rounded bg-teal-700 hover:bg-teal-800 text-slate-50">Submit</button>
            </section>
        </>
    )
}
