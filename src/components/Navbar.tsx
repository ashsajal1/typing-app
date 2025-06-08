import { Link } from "@tanstack/react-router";
import ModeToggle from "./ModeToggle";
import { Bookmark, BarChart2, Keyboard } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center bg-base-200 border-b border-base-300 justify-between p-4 shadow-md">
      <Link to="/" className="text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Keyboard size={20} strokeWidth={1.3} />
        <span className="font-medium">{t('common.practice')}</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/stats" className="btn btn-ghost gap-2 hover:bg-base-300">
          <BarChart2 size={20} strokeWidth={1.3} /> 
          <span className="hidden sm:inline">{t('common.statistics')}</span>
        </Link>
        <Link to="/saved-text" className="btn btn-ghost gap-2 hover:bg-base-300">
          <Bookmark size={20} strokeWidth={1.3} /> 
          <span className="hidden sm:inline">{t('common.savedText')}</span>
        </Link>
        <ModeToggle />
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
