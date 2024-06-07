import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 shadow dark:bg-black">
        <div className="text-success">Typing practice app</div>
        <div className="flex items-center gap-2">
            <DarkModeToggle />
            <button className="btn btm-nav-sm btn-success">Category</button>
        </div>
    </nav>
  )
}
