import TypingTest from './TypingTest'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'

// Register languages
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('java', java)

interface CodeTypingTestProps {
  text: string
  eclipsedTime: number
  language: string
}

export default function CodeTypingTest({ text, eclipsedTime, language }: CodeTypingTestProps) {
  return (
    <div className="relative">
      {/* Code preview with syntax highlighting */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '1rem',
            lineHeight: '1.5',
          }}
        >
          {text}
        </SyntaxHighlighter>
      </div>

      {/* Typing test component */}
      <TypingTest text={text} eclipsedTime={eclipsedTime} />
    </div>
  )
} 