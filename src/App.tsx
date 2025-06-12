import { ChangeEvent, useState, useEffect } from "react";
import { useSentenceStore } from "./store/sentenceStore";
import { Link } from "@tanstack/react-router";
import { Clock, BookOpen, PlusCircle, PlayCircle, Save, Bookmark } from "lucide-react";
import { TOPIC_ICONS, KEYBOARD_ELEMENTS } from "./lib/constants";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState('physics')
  const [eclipsedTime, setEclipsedTime] = useState(60)
  const [recentSavedTexts, setRecentSavedTexts] = useState<Array<{ id: string; label: string; text: string; type: string }>>([]);

  useEffect(() => {
    // Load recent saved texts
    const savedTexts = localStorage.getItem("customTextData");
    if (savedTexts) {
      const texts = JSON.parse(savedTexts);
      setRecentSavedTexts(texts.slice(-3).reverse()); // Get last 3 texts
    }
  }, []);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedTopic(value);
  };

  const handleEclipsedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setEclipsedTime(parseInt(value));
  };

  const { getAllTopics } = useSentenceStore();
  const topics = getAllTopics();
  const { sentences } = useSentenceStore();

  const getTopicIcon = (topic: string) => {
    return TOPIC_ICONS[topic.toLowerCase()] || TOPIC_ICONS.default;
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-base-100 flex flex-col">
      <div className="flex-1 flex items-start justify-center pt-8 relative">
        {/* Keyboard-inspired background pattern */}
        <div className="absolute inset-0 flex justify-center select-none">
          <div className="relative w-full max-w-2xl">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-lg bg-base-200/5 backdrop-blur-sm border border-base-300/10 animate-float"
                style={{
                  padding: '8px 12px',
                  fontSize: `${Math.random() * 12 + 12}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                  animationDelay: `${Math.random() * 5}s`,
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {KEYBOARD_ELEMENTS[Math.floor(Math.random() * KEYBOARD_ELEMENTS.length)]}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-6xl px-6 relative z-10 overflow-x-hidden">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-base-content mb-2">{t('common.practice')}</h1>
            <p className="text-base-content/70">{t('common.improveTyping')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Practice Options */}
            <div className="bg-base-200 rounded-xl shadow-lg p-8 space-y-8">
              {/* Topic Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {t('common.selectTopic')}
                </label>
                <select 
                  value={selectedTopic} 
                  onChange={handleSelectChange} 
                  className="select select-bordered w-full bg-base-100"
                >
                  <option value="" disabled>{t('common.chooseTopic')}</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic} className="flex items-center gap-2">
                      {getTopicIcon(topic)} {topic} ({sentences.filter(sen => sen.topic === topic).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('common.practiceDuration')}
                </label>
                <select 
                  value={eclipsedTime} 
                  onChange={handleEclipsedChange} 
                  className="select select-bordered w-full bg-base-100"
                >
                  <option value="" disabled>{t('common.selectDuration')}</option>
                  <option value={30}>30 {t('common.seconds')}</option>
                  <option value={60}>1 {t('common.minute')}</option>
                  <option value={120}>2 {t('common.minutes')}</option>
                  <option value={0}>{t('common.noTimeLimit')}</option>
                </select>
              </div>

              {/* Start Practice Button */}
              <Link 
                className="w-full" 
                to='/practice' 
                search={{ topic: selectedTopic, eclipsedTime: eclipsedTime }}
              >
                <button className="btn btn-primary w-full mt-2 gap-2 hover:scale-[1.02] transition-transform">
                  <PlayCircle className="w-5 h-5" />
                  {t('common.startPractice')}
                </button>
              </Link>

              {/* Additional Options */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-base-300">
                <Link className="w-full" to='/saved-text'>
                  <button className="btn btn-outline w-full gap-2 hover:bg-base-300">
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('common.savedText')}</span>
                  </button>
                </Link>
                <Link className="w-full" to='/custom-text'>
                  <button className="btn btn-outline w-full gap-2 hover:bg-base-300">
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('common.createCustomText')}</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column - Recent Saved Texts */}
            {recentSavedTexts.length > 0 ? (
              <div className="bg-base-200 rounded-xl shadow-lg p-8 space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Recent Saved Texts
                  </label>
                  <div className="space-y-2">
                    {recentSavedTexts.map((text) => (
                      <Link
                        key={text.id}
                        to="/practice"
                        search={{ 
                          savedTextId: parseInt(text.id),
                          eclipsedTime: 60,
                          topic: text.type || 'paragraph'
                        }}
                        className="block"
                      >
                        <div className="bg-base-100 rounded-lg p-3 hover:bg-base-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{text.label}</span>
                            <span className="badge badge-sm">{text.type || 'paragraph'}</span>
                          </div>
                          <p className="text-sm text-base-content/70 truncate mt-1">{text.text}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-base-200 rounded-xl shadow-lg p-8 space-y-4">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <PlusCircle className="w-12 h-12 text-base-content/40" />
                  </div>
                  <h3 className="text-lg font-medium text-base-content">No Saved Texts Yet</h3>
                  <p className="text-base-content/70">Start by creating your own custom text for practice</p>
                  <Link to="/custom-text" className="btn btn-primary gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Create New Text
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="mt-6 text-center text-sm text-base-content/60">
            <p>💡 {t('common.tip')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;