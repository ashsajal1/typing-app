import { Link } from "@tanstack/react-router";
import { ArrowLeft, HomeIcon } from "lucide-react";

export default function NotFound() {
    return (
        <div className="grid place-items-center p-12">
            <div>
                <h1 className="text-4xl text-center">404</h1>
                <p className="text-lg text-center">La page que vous recherchez n'existe pas !</p>

                <div className="flex items-center gap-3 w-full mt-4">
                    <button onClick={() => history.back()} className="btn btn-wide btn-success btn-outline">
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                    <Link to='/'>
                        <button className="btn btn-wide btn-success btn-outline">
                            <HomeIcon className="w-4 h-4" />
                            Accueil
                        </button></Link>
                </div>
            </div>
        </div>
    )
}
