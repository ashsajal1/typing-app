import { ChangeEvent, useState } from "react";
import { useSentenceStore } from "./store/sentenceStore";

export default function App() {
  const [selectedTopics, setSelectedTopics] = useState('')

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTopics(value);
  };

  const { getAllTopics } = useSentenceStore();
  const topics = getAllTopics();

  return (
    <>
      <div className="flex flex-col gap-3 p-4">
        <select value={selectedTopics} onChange={handleSelectChange} className="select select-success w-full">
          <option disabled selected>Pick your favorite anime</option>
          {topics.map(topic => (
            <option>{topic}</option>
          ))}
        </select>

        <button className="btn btn-active btn-success">Start Practice</button>
      </div>
    </>
  )
}