// Function to extract plain text from text with translations
function extractPlainText(text: string): string {
  // Replace [text](translation) with just text
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

export default function calculateAccuracy(text1: string, text2: string): string {
  // Extract plain text from both strings
  const plainText1 = extractPlainText(text1);
  const plainText2 = text2; // User input doesn't have translations

  const totalCharacters: number = plainText1.length;
  let correctCharacters: number = 0;

  for (let i: number = 0; i < totalCharacters; i++) {
    if (plainText1[i] === plainText2[i]) {
      correctCharacters++;
    }
  }

  const accuracy: number = (correctCharacters / totalCharacters) * 100;
  return accuracy.toFixed(2);
}
