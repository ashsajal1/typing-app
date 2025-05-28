import React from 'react';
import useStore from '../store/themeStore';
import { MoonIcon, SunIcon } from 'lucide-react';

type ThemeStore = typeof useStore;

declare global {
  interface Window {
    __MOCK_STORE__: ThemeStore;
  }
}

const ModeToggle = () => {
  // Use mock store in Storybook, real store otherwise
  const store = window.__MOCK_STORE__ || useStore;
  const { isDarkMode, toggleDarkMode } = store((state) => ({
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
      className="btn btn-ghost"
    >
      {isDarkMode ? <SunIcon />: <MoonIcon />}
    </button>
  );
};

export default ModeToggle;
