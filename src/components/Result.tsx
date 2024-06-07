import { RepeatIcon } from "lucide-react";

export default function Result({ accuracy, wpm }: { accuracy: number, wpm: number }) {
    let status: string;
    let emoji: string;

    if (accuracy >= 90 && wpm >= 60) {
        status = "Excellent!";
        emoji = "🎉";
    } else if (accuracy >= 80 && wpm >= 50) {
        status = "Great Job!";
        emoji = "👍";
    } else if (accuracy >= 70 && wpm >= 40) {
        status = "Good Effort!";
        emoji = "😊";
    } else {
        status = "Keep Practicing!";
        emoji = "💪";
    }

    return (
        <div className="h-screen flex items-center justify-center p-4">
            <section className="p-2 w-full md:w-1/2 h-1/2 rounded flex flex-col gap-3 bg-success justify-center items-center text-slate-50">
                <div className="text-4xl">{emoji}</div>
                <div className="text-xl">{status}</div>
                <div className="">Accuracy : {accuracy}%</div>
                <div>WPM (Word Per Minute) : {wpm}</div>
                <div>
                    <button onClick={() => window.location.reload()} className="bg-success p-2 flex items-center gap-1 rounded border">
                       <RepeatIcon className="w-4 h-4" />
                        Restart</button>
                </div>
            </section>
        </div>
    )
}
