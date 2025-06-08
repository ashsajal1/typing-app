import { useState, useRef, useEffect } from 'react';
import StatsDisplay from './StatsDisplay';
import ControlsDisplay from './ControlsDisplay';
import { franc } from 'franc';

interface NonEnTypingProps {
  text: string;
}

const NonEnTyping: React.FC<NonEnTypingProps> = ({ text }) => {
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

  // Detect language and form words accordingly
  const lang = franc(text || '');
  const words = lang === 'ben' ? text.split(" ") : text.split("");

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
    const currentWord = words[currentWordIndex];
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
    if (currentWordIndex + 1 >= words.length) {
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
            <div className="stat-desc">Out of {words.length} words</div>
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
        max={words.length}
      ></progress>

      <div 
        ref={textRef}
        className="text-xl leading-relaxed p-4 border rounded-lg h-48 overflow-y-auto"
      >
        {words.map((word, index) => (
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

export default NonEnTyping;
