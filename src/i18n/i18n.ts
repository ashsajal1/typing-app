import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import jaTranslation from './locales/ja.json';
import zhTranslation from './locales/zh.json';
import koTranslation from './locales/ko.json';
import ruTranslation from './locales/ru.json';
import arTranslation from './locales/ar.json';
import hiTranslation from './locales/hi.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      de: {
        translation: deTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
      ko: {
        translation: koTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
      ar: {
        translation: arTranslation,
      },
      hi: {
        translation: hiTranslation,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 