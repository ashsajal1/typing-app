export default function calculateAccuracy(text1: string, text2: string): string {
  const totalCharacters: number = text1.length;
  let correctCharacters: number = 0;

  for (let i: number = 0; i < totalCharacters; i++) {
    if (text1[i] === text2[i]) {
      correctCharacters++;
    }
  }

  const accuracy: number = (correctCharacters / totalCharacters) * 100;
  return accuracy.toFixed(2);
}
