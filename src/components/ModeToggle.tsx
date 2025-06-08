import useThemeStore, { themes } from '../store/themeStore';
import { MoonIcon, SunIcon, PaletteIcon } from 'lucide-react';

type ThemeStore = typeof useThemeStore;

declare global {
  interface Window {
    __MOCK_STORE__: ThemeStore;
  }
}

const ModeToggle = () => {
  // Use mock store in Storybook, real store otherwise
  const store = window.__MOCK_STORE__ || useThemeStore;
  const { currentTheme, setTheme, toggleTheme } = store((state) => ({
    currentTheme: state.currentTheme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }));

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="btn btn-ghost btn-circle"
        title="Toggle dark/light mode"
      >
        {currentTheme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
      
      <div className="dropdown dropdown-end">
        <button className="btn btn-ghost btn-circle" title="Select theme">
          <PaletteIcon />
        </button>
        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto">
          {themes.map((theme) => (
            <li key={theme}>
              <button
                onClick={() => {
                  document.documentElement.setAttribute('data-theme', theme);
                  setTheme(theme);
                }}
                className={`flex items-center gap-2 ${currentTheme === theme ? 'active' : ''}`}
              >
                <span className="capitalize">{theme}</span>
                {currentTheme === theme && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModeToggle;
