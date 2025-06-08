import { useState, useEffect } from 'react';

export default function BengaliTyping() {
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wordStatus, setWordStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  // Sample Bengali words - you can replace this with a larger dataset
  const bengaliWords = [
    'আমি', 'তুমি', 'সে', 'আমরা', 'তোমরা', 'তারা',
    'ভালো', 'খারাপ', 'সুন্দর', 'বড়', 'ছোট',
    'বাংলা', 'ইংরেজি', 'ভাষা', 'শিক্ষা', 'জ্ঞান'
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    setCurrentWord(bengaliWords[currentWordIndex]);
  }, [currentWordIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setWordStatus(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && userInput.trim()) {
      e.preventDefault();
      checkWord();
    }
  };

  const checkWord = () => {
    const isCorrect = userInput.trim() === currentWord;
    setWordStatus(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTotalWords(prev => prev + 1);
    setUserInput('');
    
    // Move to next word
    setCurrentWordIndex((prev) => (prev + 1) % bengaliWords.length);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Bengali Typing Practice</h2>
        <div className="text-4xl font-bold text-center mb-4">
          {currentWord}
        </div>
        
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full text-xl p-4"
            placeholder="Type the word..."
            autoFocus
          />
          
          {wordStatus && (
            <div className={`text-center p-2 rounded ${
              wordStatus === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {wordStatus === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
            </div>
          )}
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Score</div>
          <div className="stat-value">{score}</div>
          <div className="stat-desc">Out of {totalWords} words</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Accuracy</div>
          <div className="stat-value">
            {totalWords > 0 ? Math.round((score / totalWords) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
