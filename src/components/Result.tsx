export default function Result({ accuracy, wpm }: { accuracy: number, wpm: number }) {
    return (
        <div className="h-screen flex items-center justify-center">
            <section className="p-2 w-1/2 h-1/2 rounded flex flex-col gap-3 bg-teal-700 justify-center items-center text-slate-50">
                <div className="">Accuracy : {accuracy}%</div>
                <div>WPM (Word Per Minute) : {wpm}</div>
            </section>
        </div>
    )
}
