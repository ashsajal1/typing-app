import { ChangeEvent, useState } from "react"

export default function TypingTest() {
    const [userInput, setUserInput] = useState('');
    // const [timer, setTimer] = useState();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
        // console.log(e.target.value);
    }

    const handleSubmit= () => {
        // console.log("submitted")
    }

    return (
        <>
            <section className="p-2 flex flex-col gap-3">
                <p className="p-2 border runded text-lg font-medium">This is the text to write and test.</p>
                <input onChange={handleInputChange} className="p-2 rounded border outline-none" title="Text field" type="text" />

                <button onClick={handleSubmit} className="p-1 font-mono border rounded bg-teal-700 hover:bg-teal-800 text-slate-50">Submit</button>
            </section>
        </>
    )
}
