import { TypeIcon, Github, Twitter } from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function Footer() {
    return (
        <>
            <footer className="footer p-10 bg-base-200 text-base-content">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <TypeIcon className="w-8 h-8 text-primary" />
                            <div>
                                <p className="font-bold text-lg">Typing Practice</p>
                                <p className="text-base-content/70">Improve your typing skills</p>
                            </div>
                        </div>
                    </div>

                    {/* Practice Links */}
                    <div className="space-y-4">
                        <h6 className="footer-title text-base-content/80">Practice</h6>
                        <div className="flex flex-col gap-2">
                            <Link to="/" className="link link-hover">Home</Link>
                            <Link to="/practice" search={{ topic: 'physics', eclipsedTime: 60 }} className="link link-hover">Practice</Link>
                            <Link to="/code" className="link link-hover">Code Practice</Link>
                            <Link to="/custom-text" className="link link-hover">Custom Text</Link>
                        </div>
                    </div>

                    {/* Resources Links */}
                    <div className="space-y-4">
                        <h6 className="footer-title text-base-content/80">Resources</h6>
                        <div className="flex flex-col gap-2">
                            <Link to="/guide" className="link link-hover">Typing Guide</Link>
                            <Link to="/stats" className="link link-hover">Statistics</Link>
                            <Link to="/saved-text" className="link link-hover">Saved Texts</Link>
                            <Link to="/about" className="link link-hover">About</Link>
                        </div>
                    </div>

                    {/* Legal & Connect Links */}
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <h6 className="footer-title text-base-content/80">Legal</h6>
                                <div className="flex flex-col gap-2">
                                    <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
                                    <Link to="/terms" className="link link-hover">Terms of Service</Link>
                                </div>
                            </div>
                            <div>
                                <h6 className="footer-title text-base-content/80">Connect</h6>
                                <div className="flex flex-col gap-2">
                                    <a 
                                        href="https://github.com" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="link link-hover flex items-center gap-2"
                                    >
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </a>
                                    <a 
                                        href="https://twitter.com" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="link link-hover flex items-center gap-2"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        Twitter
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div className="w-full max-w-7xl mx-auto">
                    <p>Copyright © {new Date().getFullYear()} Typing Practice - All rights reserved</p>
                </div>
            </footer>
        </>
    )
}
