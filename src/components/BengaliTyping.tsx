import { useState, useRef, useEffect } from 'react';
import StatsDisplay from './StatsDisplay';
import ControlsDisplay from './ControlsDisplay';

export default function BengaliTyping() {
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordStatus, setWordStatus] = useState<{ [key: number]: boolean }>({});
  const textRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Sample Bengali paragraph split into words
  const bengaliWords = `বাংলা ভাষা একটি ইন্দো-আর্য ভাষা যা দক্ষিণ এশিয়ার বঙ্গ অঞ্চলের মানুষের ভাষা। এটি বাংলাদেশের রাষ্ট্রভাষা এবং ভারতের পশ্চিমবঙ্গ, ত্রিপুরা ও আসামের বরাক উপত্যকার সরকারি ভাষা। বাংলা ভাষা বিশ্বের ষষ্ঠ সর্বাধিক কথিত ভাষা। বাংলা সাহিত্যের ইতিহাস হাজার বছরের পুরনো। রবীন্দ্রনাথ ঠাকুর, কাজী নজরুল ইসলাম, বঙ্কিমচন্দ্র চট্টোপাধ্যায় প্রমুখ বাংলা সাহিত্যের উজ্জ্বল নক্ষত্র।`.split(' ');

  // Timer effect
  useEffect(() => {
    if (isStarted && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isSubmitted]);

  // WPM calculation effect
  useEffect(() => {
    if (timer > 0 && totalWords > 0) {
      const minutes = timer / 60;
      const newWpm = Math.round((score / minutes) * 5); // Multiply by 5 for standard WPM calculation
      setWpm(newWpm);
    }
  }, [timer, score, totalWords]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted) {
      setIsStarted(true);
    }
    const newInput = e.target.value;
    setUserInput(newInput);

    // Check if input ends with a space
    if (newInput.endsWith(' ')) {
      const wordToCheck = newInput.trim();
      if (wordToCheck) {
        checkWord(wordToCheck);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent default space behavior
    if (e.key === ' ') {
      e.preventDefault();
      const wordToCheck = userInput.trim();
      if (wordToCheck) {
        checkWord(wordToCheck);
      }
    }
  };

  const checkWord = (wordToCheck: string) => {
    const currentWord = bengaliWords[currentWordIndex];
    const isCorrect = wordToCheck === currentWord;
    
    // Update word status
    setWordStatus(prev => ({
      ...prev,
      [currentWordIndex]: isCorrect
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTotalWords(prev => prev + 1);
    setUserInput('');
    setCurrentWordIndex(prev => prev + 1);

    // Calculate accuracy
    const newAccuracy = Math.round((score + (isCorrect ? 1 : 0)) / (totalWords + 1) * 100);
    setAccuracy(newAccuracy);

    // Scroll to next word
    if (textRef.current) {
      const wordElement = textRef.current.children[currentWordIndex + 1] as HTMLElement;
      if (wordElement) {
        wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Check if test is complete
    if (currentWordIndex + 1 >= bengaliWords.length) {
      setIsSubmitted(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const getWordClass = (index: number) => {
    if (index < currentWordIndex) {
      return wordStatus[index] ? 'text-green-500' : 'text-red-500';
    }
    if (index === currentWordIndex) {
      return 'bg-gray-200';
    }
    return 'text-gray-400';
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Words Completed</div>
            <div className="stat-value">{currentWordIndex}</div>
            <div className="stat-desc">Out of {bengaliWords.length} words</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">WPM</div>
            <div className="stat-value">{wpm}</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Accuracy</div>
            <div className="stat-value">{accuracy}%</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="p-2 flex flex-col gap-3">
      <progress
        className="progress progress-success w-full"
        value={currentWordIndex}
        max={bengaliWords.length}
      ></progress>

      <div 
        ref={textRef}
        className="text-xl leading-relaxed p-4 border rounded-lg h-48 overflow-y-auto"
      >
        {bengaliWords.map((word, index) => (
          <span 
            key={index} 
            className={`${getWordClass(index)} mx-1`}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input input-bordered w-full text-xl p-4"
          placeholder="Type here..."
          autoFocus
        />
      </div>

      <StatsDisplay
        timer={timer}
        eclipsedTime={Infinity}
        accuracy={accuracy}
        wpm={wpm}
      />

      <ControlsDisplay
        showHighErrorChars={false}
        toggleHighErrorChars={() => {}}
        onReset={handleReset}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
