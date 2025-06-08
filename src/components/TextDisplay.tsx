import { useEffect, useRef } from "react";

interface TextDisplayProps {
  parsedText: { text: string; translation?: string }[];
  userInput: string;
  isStarted: boolean;
  showHighErrorChars: boolean;
  highErrorChars: string[];
  incorrectNewlinePosition: number | null;
  lastTypedPosition: number;
}

export default function TextDisplay({
  parsedText,
  userInput,
  isStarted,
  showHighErrorChars,
  highErrorChars,
  incorrectNewlinePosition,
  lastTypedPosition,
}: TextDisplayProps) {
  return (
    <div className="h-[300px] overflow-y-auto relative border dark:border-gray-700 rounded" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px'
    }}>
      <div className="p-2 md:text-2xl select-none flex flex-wrap gap-y-2 w-full relative [&::-webkit-scrollbar]:hidden">
        {/* Display a guidance message when not started */}
        {!isStarted && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-base-100/60 dark:bg-gray-900/70 backdrop-blur-[1px] rounded z-10">
            <div className="text-center space-y-4 mt-12">
              <p className="text-2xl text-success font-medium">
                Start typing to begin the test
              </p>
              <div className="flex items-center justify-center gap-2 text-base-content/70">
                <kbd className="kbd kbd-sm">⌨️</kbd>
                <span>Press any key to start</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <kbd className="kbd kbd-xs">Esc</kbd>
                  <span>Reset</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="kbd kbd-xs">Enter</kbd>
                  <span>Finish</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Calculate current word index and render text */}
        <div className="whitespace-pre-wrap break-words">
          {(() => {
            const currentIndex = userInput.length;
            const charIndex = 0;
            
            // Find word boundaries
            const wordBoundaries: number[] = [];
            let tempCharIndex = 0;
            parsedText.forEach(part => {
              const chars = part.text.split("");
              chars.forEach((char) => {
                if (char === " " || char === "\n" || tempCharIndex === 0) {
                  wordBoundaries.push(tempCharIndex === 0 ? 0 : tempCharIndex + 1);
                }
                tempCharIndex++;
              });
            });
            
            // Determine current word
            let currentWordStart = 0;
            let currentWordEnd = charIndex - 1;
            
            for (let i = 0; i < wordBoundaries.length; i++) {
              if (currentIndex >= wordBoundaries[i]) {
                currentWordStart = wordBoundaries[i];
                currentWordEnd = i < wordBoundaries.length - 1 ? 
                  wordBoundaries[i + 1] - 2 : // -2 to account for space and indexing
                  tempCharIndex - 1;
              }
            }
            
            // Process each character in the text
            type CharElement = {
              char: string;
              partIndex: number;
              charInPartIndex: number;
              globalIndex: number;
            };
            
            type LineData = {
              chars: CharElement[];
              partIndex: number;
              isEmpty: boolean;
            };
            
            const currentLine: CharElement[] = [];
            const lines: LineData[] = [];
            let charCount = 0;
            
            // First pass: Split text into lines
            parsedText.forEach((part, partIndex) => {
              const chars = part.text.split("");
              chars.forEach((char, charInPartIndex) => {
                currentLine.push({
                  char,
                  partIndex,
                  charInPartIndex,
                  globalIndex: charCount
                });
                
                if (char === '\n') {
                  const newLine: LineData = {
                    chars: [...currentLine],
                    partIndex,
                    isEmpty: currentLine.length === 1 && currentLine[0].char === '\n'
                  };
                  lines.push(newLine);
                  currentLine.length = 0; // Clear the array while keeping the reference
                }
                
                charCount++;
              });
            });
            
            // Add the last line if it's not empty
            if (currentLine.length > 0) {
              lines.push({
                chars: currentLine,
                partIndex: parsedText.length - 1,
                isEmpty: false
              });
            }
            
            // Render each line
            return lines.map((line, lineIndex) => {
              const { chars, isEmpty } = line;
              const lineStartIndex = chars[0]?.globalIndex ?? 0;
              const lineEndIndex = chars[chars.length - 1]?.globalIndex ?? 0;
              const isCurrentLine = currentIndex >= lineStartIndex && currentIndex <= lineEndIndex + 1;
              
              return (
                <div 
                  key={`line-${lineIndex}`}
                  className={`
                    relative 
                    ${isEmpty ? 'h-8' : 'min-h-6 py-1'} 
                    ${isCurrentLine ? 'bg-base-200/20 dark:bg-gray-700/20' : ''}
                    transition-colors duration-200
                    border-l-2
                    ${isCurrentLine ? 'border-l-success' : 'border-l-transparent'}
                    pl-2
                    rounded-r
                    ${lineIndex > 0 ? 'mt-1' : ''}
                    ${isCurrentLine ? 'ring-1 ring-success/20' : ''}
                    ${isCurrentLine ? 'after:absolute after:inset-0  after:opacity-5 after:rounded-r' : ''}
                  `}
                >
                  {chars.map(({ char, partIndex, charInPartIndex, globalIndex }) => {
                    const userChar = userInput[globalIndex];
                    const isSpace = char === ' ';
                    const isNewline = char === '\n';
                    const isCorrect = userChar === char;
                    const isIncorrect = userChar && !isCorrect;
                    const isCurrent = globalIndex === currentIndex;
                    const isCurrentWord = globalIndex >= currentWordStart && globalIndex <= currentWordEnd;
                    const isHighErrorChar = showHighErrorChars && highErrorChars.includes(char);
                    const isTyped = globalIndex < userInput.length;
                    
                    if (isNewline) {
                      // Find the index of the first newline
                      let firstNewlineIndex = -1;
                      let currentIndex = 0;
                      for (const part of parsedText) {
                        const newlineIndex = part.text.indexOf('\n');
                        if (newlineIndex !== -1) {
                          firstNewlineIndex = currentIndex + newlineIndex;
                          break;
                        }
                        currentIndex += part.text.length;
                      }
                      
                      return (
                        <div 
                          key={`${partIndex}-${charInPartIndex}`} 
                          className={`
                            relative w-full h-8 flex items-center justify-center group
                            ${isCurrent ? 'bg-base-200/30 dark:bg-gray-700/30' : ''}
                            ${isTyped ? (isCorrect ? 'bg-green-100/30 dark:bg-green-900/30' : 'bg-red-100/30 dark:bg-red-900/30') : ''}
                            transition-colors duration-200
                            before:absolute before:inset-0 before:border-t before:border-dashed
                            ${isCurrent ? 'before:border-success before:opacity-50' : 
                              isTyped ? (isCorrect ? 'before:border-green-500 before:opacity-30' : 'before:border-red-500 before:opacity-30') : 
                              'before:border-base-300 dark:before:border-gray-600 before:opacity-20'}
                          `}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`
                              text-xs font-mono
                              ${isCurrent ? 'text-success animate-pulse' : 
                                isTyped ? (isCorrect ? 'text-green-500' : 'text-red-500') : 
                                'text-base-300 dark:text-gray-600'}
                              transition-colors duration-200
                            `}>
                              ¶
                            </span>
                          </div>
                          {isCurrent && (
                            <div className={`
                              absolute 
                              ${globalIndex === firstNewlineIndex ? '-right-20' : '-top-6 left-1/2 transform -translate-x-1/2'} 
                              text-xs bg-success text-white px-2 py-1 rounded whitespace-nowrap
                              animate-bounce
                              after:absolute after:inset-0 after:rounded after:opacity-20 after:blur-sm
                              after:-z-10
                            `}>
                              Press Enter
                            </div>
                          )}
                          {globalIndex === incorrectNewlinePosition && (
                            <div className="absolute inset-0 border-2 border-red-500 rounded pointer-events-none animate-pulse" />
                          )}
                          {isTyped && !isCorrect && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-red-500 text-xs">✕</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <span
                        key={`${partIndex}-${charInPartIndex}`}
                        className={`
                          mx-[0.5px] 
                          border-b 
                          ${isCurrent ? 'border-b-success border-b-2' : 'border-b-base-300 dark:border-gray-600'} 
                          ${isCurrentWord ? 'bg-blue-100/50 dark:bg-blue-900/40 ring-1 ring-blue-300 dark:ring-blue-700' : ''}
                          p-[1px] rounded w-[27px] inline-flex items-center justify-center 
                          transition-colors duration-100
                          ${isTyped ? (
                            isCorrect ? "text-green-500 bg-green-100 dark:bg-green-900/40 dark:text-green-300" : 
                            isIncorrect ? "text-red-500 bg-red-100 dark:bg-red-900/40 dark:text-red-300" : ""
                          ) : (
                            isHighErrorChar ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" : ""
                          )}
                          ${isCurrent ? "bg-success/10 font-bold ring-1 ring-success ring-opacity-50" : ""}
                          ${globalIndex === lastTypedPosition ? 'animate-typing' : ''}
                          ${isCurrent ? 'relative' : ''}
                        `}
                        aria-current={isCurrent ? "true" : undefined}
                        ref={(el) => {
                          if (isCurrent && el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                      >
                        {isCurrent && (
                          <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs bg-success text-white px-2 py-1 rounded">
                            Type
                          </span>
                        )}
                        {parsedText[partIndex]?.translation && isCurrentWord && (
                          <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded whitespace-nowrap">
                            {parsedText[partIndex].translation}
                          </span>
                        )}
                        {isSpace ? "\u00A0" : char}
                        {globalIndex === incorrectNewlinePosition && (
                          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500" />
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
} 