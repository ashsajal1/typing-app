import { ChangeEvent, useState } from "react";
import { useSentenceStore } from "./store/sentenceStore";
import { Link } from "@tanstack/react-router";

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState('computer_sciences')
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
            <option value="" disabled>Choisissez votre sujet préféré</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic} ({sentences.filter(sen => sen.topic === topic).length})</option>
            ))}
          </select>

          <select value={eclipsedTime} onChange={handleEclipsedChange} className="select select-success w-full">
            <option value="" disabled>Choisissez le temps écoulé</option>
            <option value={60}>60</option>
            <option value={120}>120</option>
            <option value={0}>Infinity</option>
          </select>
        </div>

        <Link className="w-full" to='/practice' search={{ topic: selectedTopic, eclipsedTime: eclipsedTime }}>
          <button className="btn btn-active w-full btn-success">Commencer l'entraînement</button>
        </Link>

        <div className="flex items-center gap-2 justify-between w-full">
          <Link className="w-full" to='/saved-text'>
            <button className="btn w-full">Texte Sauvegardé</button>
          </Link>
          <Link className="w-full" to='/custom-text'>
            <button className="btn w-full">Créer un Texte Personnalisé</button>
          </Link>

        </div>
      </div>
    </>
  )
}