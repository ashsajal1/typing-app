import { useEffect, useMemo, useRef } from 'react';
import { flattenText } from '../lib/typingText';

interface TextDisplayProps {
  parsedText: { text: string; translation?: string }[];
  userInput: string;
  isStarted: boolean;
  showHighErrorChars: boolean;
  highErrorChars: string[];
  incorrectNewlinePosition: number | null;
  lastTypedPosition: number;
}

/**
 * The passage to type, on a single line that scrolls along with the caret, so
 * the on-screen keyboard below always has room to be seen.
 */
export default function TextDisplay({
  parsedText,
  userInput,
  isStarted,
  showHighErrorChars,
  highErrorChars,
  incorrectNewlinePosition,
  lastTypedPosition,
}: TextDisplayProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const chars = useMemo(() => flattenText(parsedText), [parsedText]);
  const currentIndex = userInput.length;

  // Keep the character being typed a little left of centre so the text the user
  // has yet to type is always visible. Assigned directly rather than through
  // `scrollTo` so it also works where that method is missing (jsdom); the
  // animation comes from `scroll-behavior` in the stylesheet.
  useEffect(() => {
    const viewport = viewportRef.current;
    const caret = caretRef.current;
    if (!viewport || !caret) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const target = Math.min(
      Math.max(caret.offsetLeft - viewport.clientWidth * 0.3, 0),
      Math.max(maxScroll, 0)
    );
    viewport.scrollLeft = target;
  }, [currentIndex, chars.length]);

  const caretChar = chars[currentIndex];
  const caretWordStart = caretChar ? caretChar.wordStart : -1;
  const caretWordEnd = caretChar ? caretChar.wordEnd : -1;
  const caretTranslation =
    currentIndex >= caretWordStart && currentIndex <= caretWordEnd
      ? caretChar?.translation
      : undefined;

  return (
    <div className="space-y-2">
      <div
        ref={viewportRef}
        className="relative overflow-x-hidden overflow-y-hidden rounded-lg border border-base-300 bg-base-100 px-3 py-5 scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Display a guidance message when not started */}
        {!isStarted && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-base-200/60 backdrop-blur-[1px]">
            <div className="space-y-4 text-center">
              <p className="text-2xl font-medium text-primary">Start typing to begin the test</p>
              <div className="flex items-center justify-center gap-2 text-base-content/70">
                <kbd className="kbd kbd-sm bg-base-300 text-base-content">⌨️</kbd>
                <span>Press any key to start</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <kbd className="kbd kbd-xs bg-base-300 text-base-content">Esc</kbd>
                  <span>Reset</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="kbd kbd-xs bg-base-300 text-base-content">Enter</kbd>
                  <span>Finish</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="whitespace-pre font-mono text-xl leading-relaxed md:text-2xl">
          {chars.map(({ char, index, wordStart, wordEnd }) => {
            const typedChar = userInput[index];
            const isNewline = char === '\n';
            const isSpace = char === ' ';
            const isCorrect = typedChar === char;
            const isTyped = index < userInput.length;
            const isCurrent = index === currentIndex;
            const isCurrentWord = index >= wordStart && index <= wordEnd;
            const isHighErrorChar = showHighErrorChars && highErrorChars.includes(char);
            const isWrongNewline = index === incorrectNewlinePosition;

            return (
              <span
                key={index}
                ref={
                  isCurrent
                    ? (el: HTMLSpanElement | null) => {
                        caretRef.current = el;
                      }
                    : undefined
                }
                aria-current={isCurrent ? 'true' : undefined}
                className={[
                  'relative inline-block w-[27px] border-b text-center transition-colors duration-100',
                  isCurrent
                    ? 'rounded-t border-b-2 border-b-primary font-bold text-primary'
                    : 'border-b-base-300',
                  isCurrentWord && !isCurrent ? 'text-base-content' : '',
                  isTyped
                    ? isCorrect
                      ? 'text-success'
                      : 'text-error bg-error/10 rounded-t'
                    : isHighErrorChar
                      ? 'text-warning'
                      : 'text-base-content/80',
                  // The character being typed gets a solid block so it is
                  // impossible to miss, including when it is a space.
                  isCurrent ? 'bg-primary text-primary-content rounded-t' : '',
                  index === lastTypedPosition ? 'animate-typing' : '',
                  isWrongNewline ? 'rounded-t bg-error/30 ring-1 ring-error' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {isCurrent && (
                  <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-content" />
                )}
                {/* Newlines still need Enter, but must not break the single line. */}
                {isNewline ? '⏎' : isSpace ? ' ' : char}
              </span>
            );
          })}
        </p>
      </div>

      <div className="h-5 px-1 text-xs text-base-content/70">
        {caretTranslation && (
          <span className="badge badge-primary badge-sm badge-outline">{caretTranslation}</span>
        )}
      </div>
    </div>
  );
}
