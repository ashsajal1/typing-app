export interface ParsedTextPart {
  text: string;
  translation?: string;
}

export interface FlatChar {
  char: string;
  /** Position in the flattened text, which is what `userInput` is indexed by. */
  index: number;
  translation?: string;
  /** Range of the word this character belongs to. */
  wordStart: number;
  wordEnd: number;
}

/**
 * Flattens the parsed text into one character per entry and tags each with the
 * word it belongs to, so the passage can be laid out on a single line and the
 * upcoming character can be looked up by position.
 */
export function flattenText(parsedText: ParsedTextPart[]): FlatChar[] {
  const chars: FlatChar[] = [];
  let index = 0;
  let wordStart = 0;

  for (const part of parsedText) {
    for (const char of part.text) {
      chars.push({ char, index, translation: part.translation, wordStart, wordEnd: index });
      index += 1;
      if (char === ' ' || char === '\n') wordStart = index;
    }
  }

  let cursor = 0;
  while (cursor < chars.length) {
    let end = cursor;
    while (end + 1 < chars.length && chars[end + 1].wordStart === chars[cursor].wordStart) {
      end += 1;
    }
    for (let i = cursor; i <= end; i += 1) chars[i].wordEnd = end;
    cursor = end + 1;
  }

  return chars;
}
