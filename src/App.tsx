import { ChangeEvent, useState } from "react";
import { useSentenceStore } from "./store/sentenceStore";
import { Link } from "@tanstack/react-router";

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [eclipsedTime, setEclipsedTime] = useState(60)

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTopic(value);
    console.log(value)
  };

  const handleEclipsedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setEclipsedTime(parseInt(value));
  };

  const { getAllTopics } = useSentenceStore();
  const topics = getAllTopics();
  const { sentences } = useSentenceStore()

  return (
    <>
      <div className="flex flex-col gap-3 p-12 py-48">
        <div className="flex items-center gap-2">
          <select value={selectedTopic} onChange={handleSelectChange} className="select select-success w-full">
            <option value="" disabled>Pick your favorite topic</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic} ({sentences.filter(sen => sen.topic === topic).length})</option>
            ))}
          </select>

          <select value={eclipsedTime} onChange={handleEclipsedChange} className="select select-success w-full">
            <option value="" disabled>Pick eclipsed time</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={120}>120</option>
          </select>
        </div>

        <Link className="w-full" to='/practice' search={{ topic: selectedTopic, eclipsedTime: eclipsedTime }}>
          <button className="btn btn-active w-full btn-success">Start Practice</button>
        </Link>
      </div>
    </>
  )
}