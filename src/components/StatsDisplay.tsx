interface StatsDisplayProps {
  timer: number;
  eclipsedTime: number;
  accuracy: number;
  wpm: number;
}

export default function StatsDisplay({
  timer,
  eclipsedTime,
  accuracy,
  wpm,
}: StatsDisplayProps) {
  return (
    <div className="stats shadow w-full bg-base-100 dark:bg-gray-800 rounded-lg border border-success/20">
      <div className="stat">
        <div className="stat-figure text-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="stat-title">Time</div>
        <div className="stat-value text-success">{timer}s</div>
        {eclipsedTime !== Infinity && <div className="stat-desc">of {eclipsedTime}s total</div>}
      </div>
      
      <div className="stat">
        <div className="stat-figure text-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="stat-title">Accuracy</div>
        <div className="stat-value text-success">{accuracy}%</div>
      </div>
      
      <div className="stat">
        <div className="stat-figure text-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="stat-title">WPM</div>
        <div className="stat-value text-success">{wpm}</div>
        <div className="stat-desc">Words per minute</div>
      </div>
    </div>
  );
} 