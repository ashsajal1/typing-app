import { ChangeEvent, useState } from "react";
import TypingTest from "./components/TypingTest";
import generateRandomWords from "./lib/generateRandomWords";

export default function App() {
  const [selectedTopics, setSelectedTopics] = useState('')

  const handleSelectChange = (event:ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTopics(value);
  };

  return (
    <>
      <div className="flex flex-col gap-3 p-4">
        <select value={selectedTopics} onChange={handleSelectChange} className="select select-success w-full">
          <option disabled selected>Pick your favorite anime</option>
          <option>One Piece</option>
          <option>Naruto</option>
          <option>Death Note</option>
          <option>Attack on Titan</option>
          <option>Bleach</option>
          <option>Fullmetal Alchemist</option>
          <option>Jojo's Bizarre Adventure</option>
        </select>

        <button className="btn btn-active btn-success">Start Practice</button>
      </div>
      {/* <TypingTest text={generateRandomWords()} /> */}
    </>
  )
}