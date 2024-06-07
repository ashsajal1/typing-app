import { ClockIcon } from "lucide-react"

export default function Timer({ time }: { time: number }) {
    return (
        <div className="rounded w-full border border-success p-2 flex items-center gap-2 justify-start text-success">
            <ClockIcon className="h-4 w-4" />
            <span>{time}</span>
        </div>
    )
}
