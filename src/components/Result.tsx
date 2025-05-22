import { RepeatIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface CharacterStat {
  character: string;
  totalCount: number;
  errorCount: number;
}

// Helper function to generate SHA-256 hash
async function generateSha256Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export default function Result({
  accuracy,
  wpm,
  originalText,
  userInput,
}: {
  accuracy: number;
  wpm: number;
  originalText: string;
  userInput: string;
}) {
  const [charStats, setCharStats] = useState<CharacterStat[]>([]);
  const [textHash, setTextHash] = useState<string>("");

  useEffect(() => {
    // Calculate character statistics
    const stats: Record<string, { totalCount: number; errorCount: number }> =
      {};
    const len = Math.max(originalText.length, userInput.length);

    for (let i = 0; i < len; i++) {
      const originalChar = originalText[i];
      const userChar = userInput[i];

      if (originalChar) {
        if (!stats[originalChar]) {
          stats[originalChar] = { totalCount: 0, errorCount: 0 };
        }
        stats[originalChar].totalCount++;
        if (originalChar !== userChar && userChar !== undefined) {
          stats[originalChar].errorCount++;
        }
      }
    }

    const sortedStats = Object.entries(stats)
      .map(([character, counts]) => ({
        character,
        totalCount: counts.totalCount,
        errorCount: counts.errorCount,
      }))
      .sort((a, b) => a.character.localeCompare(b.character)); // Sort alphabetically

    setCharStats(sortedStats);

    // Generate hash for the original text
    generateSha256Hash(originalText).then(setTextHash);
  }, [originalText, userInput]);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <section className="p-6 w-full md:w-3/4 lg:w-1/2 rounded-lg flex flex-col gap-4 bg-success text-slate-50 shadow-xl">
        <div className="text-center">
          <div className="text-5xl mb-2">{emoji}</div>
          <div className="text-3xl font-semibold">{status}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="bg-success-content bg-opacity-20 p-3 rounded">
            Accuracy: <span className="font-bold">{accuracy}%</span>
          </div>
          <div className="bg-success-content bg-opacity-20 p-3 rounded">
            WPM: <span className="font-bold">{wpm}</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-success-content bg-opacity-30 hover:bg-opacity-40 p-3 flex items-center justify-center gap-2 rounded border border-success-content text-lg"
          >
            <RepeatIcon className="w-5 h-5" />
            Restart Practice
          </button>
        </div>
      </section>

      <section className="p-6 w-full md:w-3/4 lg:w-1/2 rounded-lg bg-base-200 dark:bg-base-300 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Detailed Character Performance
        </h2>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Practice Text Integrity</h3>
          <p className="text-sm text-base-content dark:text-gray-400">
            SHA-256 Hash of original text:
          </p>
          <p className="font-mono text-xs break-all bg-base-100 dark:bg-base-200 p-2 rounded">
            {textHash || "Calculating..."}
          </p>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="table table-zebra table-pin-rows w-full">
            <thead>
              <tr>
                <th className="text-base">Character</th>
                <th className="text-base text-center">Total Count</th>
                <th className="text-base text-center">Error Count</th>
              </tr>
            </thead>
            <tbody>
              {charStats.map((stat) => (
                <tr key={stat.character}>
                  <td className="font-mono text-lg">
                    {stat.character === " " ? "[Space]" : stat.character}
                    {stat.character === "\n" ? "[Newline]" : ""}
                    {stat.character === "\t" ? "[Tab]" : ""}
                  </td>
                  <td className="text-center text-lg">{stat.totalCount}</td>
                  <td
                    className={`text-center text-lg font-semibold ${
                      stat.errorCount > 0 ? "text-error" : "text-success"
                    }`}
                  >
                    {stat.errorCount}
                  </td>
                </tr>
              ))}
              {charStats.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">
                    No character data to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}