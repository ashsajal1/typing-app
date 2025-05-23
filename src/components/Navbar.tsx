import { Link } from "@tanstack/react-router";
import ModeToggle from "./ModeToggle";
import { Bookmark } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center bg-base-100 dark:bg-base-300 dark:border-b dark:border-b-gray-700 justify-between p-4 shadow">
      <Link to="/" className="text-success">
        Application d'entraînement à la dactylographie
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/saved-text" className="btn btn-outlined"><Bookmark size={20} strokeWidth={1.3} /> Texte Sauvegardé</Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
