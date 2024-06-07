import TypingTest from "./components/TypingTest";
import generateRandomWords from "./lib/generateRandomWords";

export default function App() {
  return (
    <>
    <TypingTest text={generateRandomWords()} />
    </>
  )
}