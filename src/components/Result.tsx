import { RepeatIcon, Target, Zap, Clock, TrendingUp } from "lucide-react";

export default function Result({ accuracy, wpm }: { accuracy: number, wpm: number }) {
    let status: string;
    let emoji: string;
    let backgroundColor: string;
    let description: string;
    let tips: string[];
    
    // Determine level and color based on performance
    if (accuracy >= 90 && wpm >= 60) {
        status = "Excellent!";
        emoji = "🎉";
        backgroundColor = "bg-gradient-to-br from-green-500 to-green-700";
        description = "You're a typing master!";
        tips = [
            "Try increasing your speed while maintaining accuracy",
            "Practice with longer texts to build endurance",
            "Challenge yourself with more complex content"
        ];
    } else if (accuracy >= 80 && wpm >= 50) {
        status = "Great Job!";
        emoji = "👍";
        backgroundColor = "bg-gradient-to-br from-green-500 to-emerald-700";
        description = "You're getting really good at this!";
        tips = [
            "Focus on maintaining consistent speed",
            "Practice with different types of content",
            "Try to reduce your error rate"
        ];
    } else if (accuracy >= 70 && wpm >= 40) {
        status = "Good Effort!";
        emoji = "😊";
        backgroundColor = "bg-gradient-to-br from-green-500 to-teal-700";
        description = "Nice work, keep practicing!";
        tips = [
            "Focus on accuracy before speed",
            "Practice regularly to build muscle memory",
            "Take breaks to avoid fatigue"
        ];
    } else {
        status = "Keep Practicing!";
        emoji = "💪";
        backgroundColor = "bg-gradient-to-br from-green-500 to-cyan-700";
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
        <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <section className={`p-6 sm:p-8 w-full max-w-3xl mx-auto my-4 rounded-lg shadow-2xl flex flex-col gap-6 ${backgroundColor} text-white relative overflow-hidden`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute rounded-full bg-white animate-pulse" 
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
                
                {/* Content */}
                <div className="flex justify-center items-center mb-2">
                    <div className="text-6xl mb-2 animate-bounce">{emoji}</div>
                </div>
                
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2 animate-fade-in">{status}</h1>
                    <p className="text-white/80 mb-6">{description}</p>
                    
                    {/* Stars rating */}
                    <div className="flex justify-center mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                                key={i} 
                                className={`text-2xl transition-all duration-300 ${i < stars ? 'text-yellow-300 scale-110' : 'text-white/30'}`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/20 rounded-lg p-4 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
                        <Target className="w-6 h-6 mb-2" />
                        <div className="text-sm">Accuracy</div>
                        <div className="text-2xl font-bold">{accuracy}%</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
                        <Zap className="w-6 h-6 mb-2" />
                        <div className="text-sm">WPM</div>
                        <div className="text-2xl font-bold">{wpm}</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
                        <TrendingUp className="w-6 h-6 mb-2" />
                        <div className="text-sm">Words per Error</div>
                        <div className="text-2xl font-bold">{wordsPerError}</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
                        <Clock className="w-6 h-6 mb-2" />
                        <div className="text-sm">Error Rate</div>
                        <div className="text-2xl font-bold">{errorRate}%</div>
                    </div>
                </div>

                {/* Tips section */}
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Tips for Improvement</h3>
                    <ul className="space-y-2">
                        {tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-yellow-300">•</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="flex justify-center">
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-white text-green-700 py-3 px-6 rounded-full font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <RepeatIcon className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </section>
        </div>
    )
}
