import { TypeIcon } from "lucide-react"

export default function Footer() {
    return (
        <>
            <footer className="footer p-10 bg-base-200 dark:bg-base-300 text-base-content">
                <aside>
                    <TypeIcon />
                    <p>Application d'Entraînement à la Dactylographie.<br />Entraînez-vous à taper</p>
                </aside>
            </footer>

            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <aside>
                    <p>Droit d'auteur &copy; {new Date().getFullYear()} - Tous droits réservés par Application d'Entraînement à la Dactylographie</p>
                </aside>
            </footer>
        </>
    )
}
