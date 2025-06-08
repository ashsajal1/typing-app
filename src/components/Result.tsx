import { RepeatIcon, Target, Zap, Clock, TrendingUp } from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Result({ accuracy, wpm, wpmHistory = [], currentErrorMap, currentTotalErrors }: { 
    accuracy: number, 
    wpm: number, 
    wpmHistory?: number[],
    currentErrorMap: Map<string, number>,
    currentTotalErrors: number 
}) {
    let status: string;
    let emoji: string;
    let backgroundColor: string;
    let description: string;
    let tips: string[];
    
    // Determine level and color based on performance
    if (accuracy >= 90 && wpm >= 60) {
        status = "Excellent!";
        emoji = "🎉";
        backgroundColor = "bg-success";
        description = "You're a typing master!";
        tips = [
            "Try increasing your speed while maintaining accuracy",
            "Practice with longer texts to build endurance",
            "Challenge yourself with more complex content"
        ];
    } else if (accuracy >= 80 && wpm >= 50) {
        status = "Great Job!";
        emoji = "👍";
        backgroundColor = "bg-success/90";
        description = "You're getting really good at this!";
        tips = [
            "Focus on maintaining consistent speed",
            "Practice with different types of content",
            "Try to reduce your error rate"
        ];
    } else if (accuracy >= 70 && wpm >= 40) {
        status = "Good Effort!";
        emoji = "😊";
        backgroundColor = "bg-success/80";
        description = "Nice work, keep practicing!";
        tips = [
            "Focus on accuracy before speed",
            "Practice regularly to build muscle memory",
            "Take breaks to avoid fatigue"
        ];
    } else {
        status = "Keep Practicing!";
        emoji = "💪";
        backgroundColor = "bg-success/70";
        description = "You'll improve with more practice!";
        tips = [
            "Start with shorter texts",
            "Focus on accuracy over speed",
            "Practice daily to build consistency"
        ];
    }
    
    // Calculate stars based on performance (1-5)
    const stars = Math.max(1, Math.min(5, Math.floor((accuracy + wpm) / 30)));

    // Calculate performance metrics
    const errorRate = 100 - accuracy;
    const wordsPerError = errorRate > 0 ? (wpm / errorRate).toFixed(1) : "∞";

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-base-100 flex items-center justify-center p-4">
            <section className={`p-4 sm:p-6 w-full max-w-4xl mx-auto my-4 rounded-lg shadow-2xl ${backgroundColor} text-base-content relative overflow-hidden`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute rounded-full bg-base-content animate-pulse" 
                                style={{
                                    width: `${Math.random() * 30 + 10}px`,
                                    height: `${Math.random() * 30 + 10}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.5,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {/* Left Column - Stats and Chart */}
                    <div className="space-y-4">
                        {/* Header with Emoji and Status */}
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-4xl animate-bounce">{emoji}</div>
                            <div>
                                <h1 className="text-2xl font-bold animate-fade-in">{status}</h1>
                                <p className="text-base-content/80 text-sm">{description}</p>
                            </div>
                        </div>

                        {/* Stars rating */}
                        <div className="flex gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                    key={i} 
                                    className={`text-xl transition-all duration-300 ${i < stars ? 'text-warning scale-110' : 'text-base-content/30'}`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-base-content/20 rounded-lg p-3 flex items-center gap-3">
                                <Target className="w-5 h-5" />
                                <div>
                                    <div className="text-xs opacity-80">Accuracy</div>
                                    <div className="text-xl font-bold">{accuracy}%</div>
                                </div>
                            </div>
                            <div className="bg-base-content/20 rounded-lg p-3 flex items-center gap-3">
                                <Zap className="w-5 h-5" />
                                <div>
                                    <div className="text-xs opacity-80">WPM</div>
                                    <div className="text-xl font-bold">{wpm}</div>
                                </div>
                            </div>
                            <div className="bg-base-content/20 rounded-lg p-3 flex items-center gap-3">
                                <TrendingUp className="w-5 h-5" />
                                <div>
                                    <div className="text-xs opacity-80">Words/Error</div>
                                    <div className="text-xl font-bold">{wordsPerError}</div>
                                </div>
                            </div>
                            <div className="bg-base-content/20 rounded-lg p-3 flex items-center gap-3">
                                <Clock className="w-5 h-5" />
                                <div>
                                    <div className="text-xs opacity-80">Error Rate</div>
                                    <div className="text-xl font-bold">{errorRate}%</div>
                                </div>
                            </div>
                        </div>

                        {/* WPM Chart */}
                        <div className="bg-base-content/20 rounded-lg p-3">
                            <h3 className="text-sm font-semibold mb-2">WPM Progress</h3>
                            <div className="h-24">
                                <Line
                                    data={{
                                        labels: wpmHistory.map((_, i) => i + 1),
                                        datasets: [
                                            {
                                                label: 'WPM',
                                                data: wpmHistory,
                                                borderColor: 'rgba(var(--bc) / 0.8)',
                                                backgroundColor: 'rgba(var(--bc) / 0.2)',
                                                tension: 0.4,
                                                fill: true,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            tooltip: {
                                                mode: 'index',
                                                intersect: false,
                                                backgroundColor: 'rgba(var(--bc) / 0.8)',
                                                titleColor: 'rgba(var(--b1))',
                                                bodyColor: 'rgba(var(--b1))',
                                                callbacks: {
                                                    label: (context) => `WPM: ${context.parsed.y}`
                                                }
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: 'rgba(var(--bc) / 0.1)',
                                                },
                                                ticks: {
                                                    color: 'rgba(var(--bc) / 0.7)',
                                                    maxTicksLimit: 4,
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    color: 'rgba(var(--bc) / 0.1)',
                                                },
                                                ticks: {
                                                    color: 'rgba(var(--bc) / 0.7)',
                                                    maxTicksLimit: 5,
                                                }
                                            },
                                        },
                                        interaction: {
                                            mode: 'nearest',
                                            axis: 'x',
                                            intersect: false
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Tips and Action Button */}
                    <div className="space-y-4">
                        {/* Tips section */}
                        <div className="bg-base-content/10 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-3">Tips for Improvement</h3>
                            <ul className="space-y-2">
                                {tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-warning">•</span>
                                        <span className="text-sm">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Error Analysis */}
                        <div className="bg-base-content/10 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-3">Mistakes Analysis</h3>
                            {currentTotalErrors > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Total Mistakes:</span>
                                        <span className="font-medium">{currentTotalErrors}</span>
                                    </div>
                                    
                                    {/* Pie Chart */}
                                    <div className="h-48">
                                        <Pie
                                            data={{
                                                labels: Array.from(currentErrorMap.keys()),
                                                datasets: [{
                                                    data: Array.from(currentErrorMap.values()),
                                                    backgroundColor: [
                                                        '#FF6B6B', // Red
                                                        '#4ECDC4', // Teal
                                                        '#FFD93D', // Yellow
                                                        '#95E1D3', // Mint
                                                        '#FF8B94', // Pink
                                                        '#6C5CE7', // Purple
                                                        '#A8E6CF', // Light Green
                                                        '#FFB6B9', // Light Pink
                                                        '#B8F2E6', // Aqua
                                                        '#AED9E0', // Sky Blue
                                                    ],
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    borderWidth: 1,
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                        labels: {
                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                            font: {
                                                                size: 11,
                                                                weight: '500'
                                                            },
                                                            padding: 20
                                                        }
                                                    },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        titleColor: 'white',
                                                        bodyColor: 'white',
                                                        padding: 12,
                                                        callbacks: {
                                                            label: (context) => {
                                                                const value = context.raw as number;
                                                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                                                const percentage = Math.round((value / total) * 100);
                                                                return `${context.label}: ${value} (${percentage}%)`;
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm opacity-80">Most Common Mistakes:</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Array.from(currentErrorMap.entries())
                                                .sort((a, b) => b[1] - a[1])
                                                .slice(0, 4)
                                                .map(([char, count]) => (
                                                    <div key={char} className="bg-base-content/20 rounded p-2 flex items-center justify-between">
                                                        <span className="font-mono">{char}</span>
                                                        <span className="text-warning">{count}x</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-2 text-success">
                                    Perfect! No mistakes made.
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => window.location.reload()} 
                                className="btn btn-primary w-full gap-2"
                            >
                                <RepeatIcon className="w-4 h-4" />
                                Try Again
                            </button>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="btn btn-outline w-full gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Restart Test
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
