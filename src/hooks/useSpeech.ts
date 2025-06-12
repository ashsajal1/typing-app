import { useState, useCallback } from 'react';
import { franc } from 'franc';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Map franc language codes to speech synthesis language codes
const languageMap: Record<string, string> = {
  'cmn': 'zh-CN',  // Chinese
  'jpn': 'ja-JP',  // Japanese
  'kor': 'ko-KR',  // Korean
  'ara': 'ar-SA',  // Arabic
  'rus': 'ru-RU',  // Russian
  'eng': 'en-US',  // English
  'fra': 'fr-FR',  // French
  'deu': 'de-DE',  // German
  'spa': 'es-ES',  // Spanish
  'ita': 'it-IT',  // Italian
  'por': 'pt-BR',  // Portuguese
  'hin': 'hi-IN',  // Hindi
  'ben': 'bn-BD',  // Bengali (Bangladesh)
  'bng': 'bn-BD',  // Alternative code for Bengali
  'bcl': 'bn-BD',  // Bicolano (sometimes used for Bengali)
  'tur': 'tr-TR',  // Turkish
  'nld': 'nl-NL',  // Dutch
  'pol': 'pl-PL',  // Polish
  'ukr': 'uk-UA',  // Ukrainian
  'heb': 'he-IL',  // Hebrew
  'swe': 'sv-SE',  // Swedish
  'nor': 'nb-NO',  // Norwegian
};

export const useSpeech = (options: UseSpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>('');

  const { rate = 1, pitch = 1, volume = 1 } = options;

  // Function to detect language from text using franc
  const detectLanguage = (text: string): string => {
    const detectedLang = franc(text, { minLength: 1 });
    return languageMap[detectedLang] || 'en-US';
  };

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const words = text.split(/\s+/);
    let currentIndex = 0;

    const speakNextWord = () => {
      if (currentIndex >= words.length) {
        setIsSpeaking(false);
        setCurrentWord('');
        return;
      }

      const word = words[currentIndex];
      setCurrentWord(word);

      const utterance = new SpeechSynthesisUtterance(word);
      const lang = detectLanguage(word);
      
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onend = () => {
        currentIndex++;
        if (!isPaused) {
          speakNextWord();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsSpeaking(true);
    setIsPaused(false);
    speakNextWord();
  }, [rate, pitch, volume, isPaused]);

  const pause = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWord('');
    }
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    currentWord,
  };
}; 