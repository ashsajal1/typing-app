import { useState, useRef } from 'react';

export default function BengaliTyping() {
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  // Sample Bengali paragraph
  const bengaliParagraph = `বাংলা ভাষা একটি ইন্দো-আর্য ভাষা যা দক্ষিণ এশিয়ার বঙ্গ অঞ্চলের মানুষের ভাষা। এটি বাংলাদেশের রাষ্ট্রভাষা এবং ভারতের পশ্চিমবঙ্গ, ত্রিপুরা ও আসামের বরাক উপত্যকার সরকারি ভাষা। বাংলা ভাষা বিশ্বের ষষ্ঠ সর্বাধিক কথিত ভাষা। বাংলা সাহিত্যের ইতিহাস হাজার বছরের পুরনো। রবীন্দ্রনাথ ঠাকুর, কাজী নজরুল ইসলাম, বঙ্কিমচন্দ্র চট্টোপাধ্যায় প্রমুখ বাংলা সাহিত্যের উজ্জ্বল নক্ষত্র।`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setUserInput(newInput);
    
    // Update position and check correctness
    if (newInput.length > currentPosition) {
      const newChar = newInput[newInput.length - 1];
      const expectedChar = bengaliParagraph[currentPosition];
      
      if (newChar === expectedChar) {
        setScore(prev => prev + 1);
      }
      setTotalChars(prev => prev + 1);
      setCurrentPosition(newInput.length);
    } else {
      setCurrentPosition(newInput.length);
    }

    // Scroll to current position
    if (textRef.current) {
      const charElement = textRef.current.children[currentPosition] as HTMLElement;
      if (charElement) {
        charElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const getCharClass = (index: number) => {
    if (index < currentPosition) {
      return userInput[index] === bengaliParagraph[index] 
        ? 'text-green-500' 
        : 'text-red-500';
    }
    if (index === currentPosition) {
      return 'bg-gray-200';
    }
    return 'text-gray-400';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Bengali Typing Practice</h2>
        
        <div 
          ref={textRef}
          className="text-xl leading-relaxed p-4 border rounded-lg h-48 overflow-y-auto mb-4"
        >
          {bengaliParagraph.split('').map((char, index) => (
            <span 
              key={index} 
              className={`${getCharClass(index)}`}
            >
              {char}
            </span>
          ))}
        </div>
        
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="input input-bordered w-full text-xl p-4"
            placeholder="Start typing..."
            autoFocus
          />
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Progress</div>
          <div className="stat-value">
            {Math.round((currentPosition / bengaliParagraph.length) * 100)}%
          </div>
          <div className="stat-desc">
            {currentPosition} / {bengaliParagraph.length} characters
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Accuracy</div>
          <div className="stat-value">
            {totalChars > 0 ? Math.round((score / totalChars) * 100) : 0}%
          </div>
          <div className="stat-desc">
            {score} correct out of {totalChars} typed
          </div>
        </div>
      </div>
    </div>
  );
}
