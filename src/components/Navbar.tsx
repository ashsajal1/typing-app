import { Link } from "@tanstack/react-router";
import ModeToggle from "./ModeToggle";
import { Bookmark, BarChart2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center bg-base-100 dark:bg-base-300 dark:border-b dark:border-b-gray-700 justify-between p-4 shadow">
      <Link to="/" className="text-success">
        Typing practice app
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/stats" className="btn btn-outlined">
          <BarChart2 size={20} strokeWidth={1.3} /> Stats
        </Link>
        <Link to="/saved-text" className="btn btn-outlined">
          <Bookmark size={20} strokeWidth={1.3} /> Saved Text
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
