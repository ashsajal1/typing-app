import { SunIcon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 shadow">
        <div>Typing practice app</div>
        <div className="flex items-center gap-2">
            <button className="btn">
                <SunIcon />
            </button>
            <button className="btn btm-nav-sm btn-success">Category</button>
        </div>
    </nav>
  )
}
