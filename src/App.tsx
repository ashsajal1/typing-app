import { ChangeEvent, useState } from "react";
import { useSentenceStore } from "./store/sentenceStore";
import { Link } from "@tanstack/react-router";

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState('')

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTopic(value);
    console.log(value)
  };

  const { getAllTopics } = useSentenceStore();
  const topics = getAllTopics();

  return (
    <>
      <div className="flex flex-col gap-3 p-12 py-48">
        <select value={selectedTopic} onChange={handleSelectChange} className="select select-success w-full">
          <option value="" disabled>Pick your favorite anime</option>
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>

        <Link className="w-full" to='/practice' search={{ topic: selectedTopic }}>
          <button className="btn btn-active w-full btn-success">Start Practice</button>
        </Link>
      </div>
    </>
  )
}