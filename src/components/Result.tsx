export default function Result({ accuracy, wpm }: { accuracy: number, wpm: number }) {
    return (
        <section className="p-2 flex flex-col gap-3">
            <div>Accuracy is {accuracy}%</div>
            <div>WPM (Wrod Per Minute) : {wpm}</div>
        </section>
    )
}
