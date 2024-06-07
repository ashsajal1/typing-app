import React from 'react';
import useStore from '../store/themeStore';
import { MoonIcon, SunIcon } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useStore((state) => ({
    isDarkMode: state.isDarkMode,
    toggleDarkMode: state.toggleTheme,
  }));

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className="btn"
    >
      {isDarkMode ? <SunIcon />: <MoonIcon />}
    </button>
  );
};

export default DarkModeToggle;
