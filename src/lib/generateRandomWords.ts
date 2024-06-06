import words from "./words";

export default function generateRandomWords(): string {
  const randomWords: string[] = [];

  while (randomWords.length < 50) {
    const randomIndex: number = Math.floor(Math.random() * words.length);
    const randomWord: string = words[randomIndex];
    randomWords.push(randomWord);
  }

  return randomWords.join(" ");
}


