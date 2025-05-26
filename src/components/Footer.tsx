import { TypeIcon } from "lucide-react"

export default function Footer() {
    return (
        <>
            <footer className="footer p-10 bg-base-200 dark:bg-base-300 text-base-content">
                <aside>
                    <TypeIcon />
                    <p>Application d'Entraînement à la Dactylographie.<br />Entraînez-vous à taper</p>
                </aside>
                <nav>
                    <h6 className="footer-title">Services</h6>
                    <a className="link link-hover">Image de marque</a>
                    <a className="link link-hover">Conception</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Publicité</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Entreprise</h6>
                    <a className="link link-hover">Emplois</a>
                    <a className="link link-hover">Dossier de presse</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Légal</h6>
                    <a className="link link-hover">Conditions d'utilisation</a>
                    <a className="link link-hover">Politique de confidentialité</a>
                    <a className="link link-hover">Politique concernant les cookies</a>
                </nav>
            </footer>

            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <aside>
                    <p>Droit d'auteur &copy; {new Date().getFullYear()} - Tous droits réservés par Application d'Entraînement à la Dactylographie</p>
                </aside>
            </footer>
        </>
    )
}
