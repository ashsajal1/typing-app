import { TypeIcon, Github, Twitter } from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function Footer() {
    return (
        <>
            <footer className="footer p-10 bg-base-200 text-base-content">
                <aside>
                    <div className="flex items-center gap-2">
                        <TypeIcon className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-bold text-lg">Typing Practice</p>
                            <p className="text-base-content/70">Improve your typing skills</p>
                        </div>
                    </div>
                </aside>
                <nav>
                    <h6 className="footer-title">Practice</h6>
                    <Link to="/" className="link link-hover">Home</Link>
                    <Link to="/practice" search={{ topic: 'physics', eclipsedTime: 60 }} className="link link-hover">Practice</Link>
                    <Link to="/code" className="link link-hover">Code Practice</Link>
                    <Link to="/custom-text" className="link link-hover">Custom Text</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Resources</h6>
                    <Link to="/guide" className="link link-hover">Typing Guide</Link>
                    <Link to="/stats" className="link link-hover">Statistics</Link>
                    <Link to="/saved-text" className="link link-hover">Saved Texts</Link>
                    <Link to="/about" className="link link-hover">About</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Connect</h6>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="link link-hover flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="link link-hover flex items-center gap-2">
                        <Twitter className="w-4 h-4" />
                        Twitter
                    </a>
                </nav>
            </footer>

            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} Typing Practice - All rights reserved</p>
                </aside>
            </footer>
        </>
    )
}
