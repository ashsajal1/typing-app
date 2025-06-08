import { ChangeEvent, useState } from "react";
import { useSentenceStore } from "./store/sentenceStore";
import { Link } from "@tanstack/react-router";
import { Clock, BookOpen, PlusCircle, PlayCircle, Save } from "lucide-react";

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState('physics')
  const [eclipsedTime, setEclipsedTime] = useState(60)

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTopic(value);
  };

  const handleEclipsedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setEclipsedTime(parseInt(value));
  };

  const { getAllTopics } = useSentenceStore();
  const topics = getAllTopics();
  const { sentences } = useSentenceStore();

  const getTopicIcon = (topic: string) => {
    switch (topic.toLowerCase()) {
      case 'physics':
        return '⚛️';
      case 'programming':
        return '💻';
      case 'literature':
        return '📚';
      case 'history':
        return '📜';
      case 'science':
        return '🔬';
      default:
        return '📝';
    }
  };

  // Keyboard keys and symbols for the background
  const keyboardElements = [
    '⌨️', '⌘', '⌥', '⇧', '⌃', '↵', '⌫', '⇥',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
    '←', '→', '↑', '↓'
  ];

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-base-100 flex items-start justify-center pt-8 relative">
      {/* Keyboard-inspired background pattern */}
      <div className="absolute inset-0 flex justify-center select-none">
        <div className="relative w-full max-w-2xl">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-lg bg-base-200/5 backdrop-blur-sm border border-base-300/10 animate-float"
              style={{
                padding: '8px 12px',
                fontSize: `${Math.random() * 12 + 12}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              {keyboardElements[Math.floor(Math.random() * keyboardElements.length)]}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl px-6 relative z-10 overflow-x-hidden">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">Typing Practice</h1>
          <p className="text-base-content/70">Improve your typing speed and accuracy</p>
        </div>

        <div className="bg-base-200 rounded-xl shadow-lg p-6 space-y-6">
          {/* Topic Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Select Topic
            </label>
            <select 
              value={selectedTopic} 
              onChange={handleSelectChange} 
              className="select select-bordered w-full bg-base-100"
            >
              <option value="" disabled>Choose a topic to practice</option>
              {topics.map(topic => (
                <option key={topic} value={topic} className="flex items-center gap-2">
                  {getTopicIcon(topic)} {topic} ({sentences.filter(sen => sen.topic === topic).length})
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Practice Duration
            </label>
            <select 
              value={eclipsedTime} 
              onChange={handleEclipsedChange} 
              className="select select-bordered w-full bg-base-100"
            >
              <option value="" disabled>Select practice duration</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={0}>No time limit</option>
            </select>
          </div>

          {/* Start Practice Button */}
          <Link 
            className="w-full" 
            to='/practice' 
            search={{ topic: selectedTopic, eclipsedTime: eclipsedTime }}
          >
            <button className="btn btn-primary w-full mt-2 gap-2 hover:scale-[1.02] transition-transform">
              <PlayCircle className="w-5 h-5" />
              Start Practice
            </button>
          </Link>

          {/* Additional Options */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-base-300">
            <Link className="w-full" to='/saved-text'>
              <button className="btn btn-outline w-full gap-2 hover:bg-base-300">
                <Save className="w-4 h-4" />
                Saved Text
              </button>
            </Link>
            <Link className="w-full" to='/custom-text'>
              <button className="btn btn-outline w-full gap-2 hover:bg-base-300">
                <PlusCircle className="w-4 h-4" />
                Create Custom Text
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 text-center text-sm text-base-content/60">
          <p>💡 Tip: Start with shorter durations and gradually increase as you improve</p>
        </div>
      </div>
    </div>
  )
}