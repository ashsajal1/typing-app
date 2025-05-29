import { useCallback, useEffect, useState } from 'react'
import Result from './Result'

interface CodeTypingTestProps {
  text: string
  eclipsedTime: number
  language: string
}

export default function CodeTypingTest({ text, eclipsedTime }: CodeTypingTestProps) {
  const [userInput, setUserInput] = useState('')
  const [timer, setTimer] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [accuracy, setAccuracy] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [wpmHistory, setWpmHistory] = useState<number[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [totalKeystrokes, setTotalKeystrokes] = useState(0)
  const [hasMistake, setHasMistake] = useState(false)
  const [showMistakeAlert, setShowMistakeAlert] = useState(false)
  const [currentLine, setCurrentLine] = useState(1)
  const [currentColumn, setCurrentColumn] = useState(0)

  // Split text into lines for line numbers
  const lines = text.split('\n')
  const maxLineNumberWidth = lines.length.toString().length

  const handleSubmit = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true)
      return
    }

    const wordPerMinute = Math.round(
      userInput.split(' ').length / (timer / 60)
    )
    setWpm(Number.isFinite(wordPerMinute) ? wordPerMinute : 0)

    const finalAccuracy = totalKeystrokes > 0 ? 
      Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100) : 0
    setAccuracy(Number.isFinite(finalAccuracy) ? finalAccuracy : 0)

    setIsSubmitted(true)
  }, [isStarted, timer, userInput, mistakes, totalKeystrokes])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setUserInput('')
      setTimer(0)
      setIsStarted(false)
      setAccuracy(0)
      setWpm(0)
      setIsSubmitted(false)
      setMistakes(0)
      setTotalKeystrokes(0)
      setHasMistake(false)
      setShowMistakeAlert(false)
      setCurrentLine(1)
      setCurrentColumn(0)
      return
    }

    if (event.key === 'Enter' && !isStarted) {
      handleSubmit()
      return
    }

    if (!isStarted) {
      setIsStarted(true)
    }

    if (hasMistake && event.key !== 'Backspace') {
      event.preventDefault()
      setShowMistakeAlert(true)
      setTimeout(() => setShowMistakeAlert(false), 2000)
      return
    }

    const expectedChar = text[userInput.length]
    const isBackspace = event.key === 'Backspace'

    // Handle special keys
    if (event.key === 'Tab') {
      event.preventDefault()
      setUserInput(prev => prev + '    ') // Add 4 spaces for tab
      setCurrentColumn(prev => prev + 4)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      setUserInput(prev => {
        const newInput = prev + '\n'
        if (expectedChar !== '\n') {
          setMistakes(prev => prev + 1)
          setHasMistake(true)
          setShowMistakeAlert(true)
          setTimeout(() => setShowMistakeAlert(false), 2000)
        }
        setCurrentLine(prev => prev + 1)
        setCurrentColumn(0)
        setTotalKeystrokes(prev => prev + 1)
        return newInput
      })
      return
    }

    if (isBackspace) {
      setUserInput(prev => {
        const newInput = prev.slice(0, -1)
        if (hasMistake && newInput.length === prev.length - 1) {
          setHasMistake(false)
          setShowMistakeAlert(false)
        }
        
        // Update line and column for backspace
        if (newInput.endsWith('\n')) {
          const lastNewLineIndex = newInput.lastIndexOf('\n')
          const lastLine = newInput.slice(lastNewLineIndex + 1)
          setCurrentLine(prev => prev - 1)
          setCurrentColumn(lastLine.length)
        } else {
          setCurrentColumn(prev => prev - 1)
        }
        
        return newInput
      })
    } else {
      // Get the actual character to type
      let charToType = event.key
      
      // Handle special cases
      if (event.key === ' ') {
        charToType = ' '
      } else if (event.key.length === 1) {
        // Only process single character keys
        charToType = event.key
      } else {
        // Skip other special keys
        return
      }

      setUserInput(prev => {
        const newInput = prev + charToType
        if (expectedChar !== charToType) {
          setMistakes(prev => prev + 1)
          setHasMistake(true)
          setShowMistakeAlert(true)
          setTimeout(() => setShowMistakeAlert(false), 2000)
        }

        setCurrentColumn(prev => prev + 1)
        setTotalKeystrokes(prev => prev + 1)
        return newInput
      })
    }
  }, [handleSubmit, isStarted, text, userInput.length, hasMistake])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isStarted && !isSubmitted) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isStarted, isSubmitted])

  useEffect(() => {
    if (isStarted && !isSubmitted) {
      const wordPerMinute = Math.round(
        userInput.split(' ').length / (timer / 60)
      )
      const currentWpm = Number.isFinite(wordPerMinute) ? wordPerMinute : 0
      setWpm(currentWpm)
      setWpmHistory(prev => [...prev, currentWpm])

      const accuracy = totalKeystrokes > 0 ? 
        Math.round(((totalKeystrokes - mistakes) / totalKeystrokes) * 100) : 0
      setAccuracy(Number.isFinite(accuracy) ? accuracy : 0)
    }
  }, [timer, userInput, isStarted, isSubmitted, mistakes, totalKeystrokes])

  useEffect(() => {
    if (!(eclipsedTime === 0) && timer === eclipsedTime) {
      handleSubmit()
      setIsSubmitted(true)
    }
  }, [eclipsedTime, handleSubmit, timer])

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <Result 
          wpm={wpm} 
          accuracy={accuracy} 
          wpmHistory={wpmHistory} 
          currentErrorMap={new Map()}
          currentTotalErrors={mistakes}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Progress bar */}
      {eclipsedTime !== Infinity && (
        <progress
          className="progress progress-success w-full mb-4"
          value={timer}
          max={eclipsedTime}
        />
      )}

      {/* Mistake Alert */}
      {showMistakeAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          Fix the mistake before continuing!
        </div>
      )}

      {/* Code editor view */}
      <div className="grid grid-cols-[auto_1fr] gap-4 bg-[#1e1e1e] rounded-lg overflow-hidden">
        {/* Line numbers */}
        <div className="select-none text-right pr-4 text-gray-500 dark:text-gray-400 font-mono bg-[#252526] py-4">
          {lines.map((_, index) => (
            <div 
              key={index}
              className={`h-6 leading-6 ${currentLine === index + 1 ? 'text-blue-500 font-bold' : ''}`}
            >
              {(index + 1).toString().padStart(maxLineNumberWidth, ' ')}
            </div>
          ))}
        </div>

        {/* Code content */}
        <div className="relative py-4">
          <div className="font-mono whitespace-pre-wrap break-all text-base leading-6">
            {text.split('').map((char, index) => {
              const userChar = userInput[index]
              const isCorrect = userChar === char
              const isIncorrect = userChar && !isCorrect
              const isCurrent = index === userInput.length
              const isTyped = index < userInput.length
              const isWhitespace = char === ' ' || char === '\t' || char === '\n'

              return (
                <span
                  key={index}
                  className={`
                    ${isTyped ? (
                      isCorrect ? "text-green-500" : 
                      isIncorrect ? (
                        isWhitespace ? "bg-red-500/30" : "text-red-500"
                      ) : ""
                    ) : "text-gray-500"}
                    ${isCurrent ? "bg-blue-500/20" : ""}
                    ${isWhitespace ? "whitespace-pre" : ""}
                  `}
                >
                  {char}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div>WPM: {wpm}</div>
        <div>Accuracy: {accuracy}%</div>
        <div>Time: {timer}s</div>
        <div>Line: {currentLine}, Col: {currentColumn}</div>
      </div>

      {/* Instructions */}
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
    </div>
  )
} 