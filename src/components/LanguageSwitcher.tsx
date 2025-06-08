import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md ${
          i18n.language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded-md ${
          i18n.language === 'es' ? 'bg-primary text-white' : 'bg-gray-200'
        }`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher; 