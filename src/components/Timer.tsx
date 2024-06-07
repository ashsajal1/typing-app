import { ClockIcon } from "lucide-react"

export default function Timer({ time }: { time: number }) {
    return (
        <div className="rounded border border-teal-700 p-2 flex items-center gap-2 justify-center text-teal-700">
            <ClockIcon className="h-4 w-4" />
            <span>{time}</span>
        </div>
    )
}
