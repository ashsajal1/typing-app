import { Link } from "@tanstack/react-router";
import { ArrowLeft, HomeIcon } from "lucide-react";

export default function NotFound() {
    return (
        <div className="grid place-items-center p-12">
            <div>
                <h1 className="text-4xl text-center">404</h1>
                <p className="text-lg text-center">The page you're looking for doesn't exist!</p>

                <div className="flex items-center gap-3 w-full mt-4">
                    <button onClick={() => history.back()} className="btn btn-wide btn-success btn-outline">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <Link to='/'>
                        <button className="btn btn-wide btn-success btn-outline">
                            <HomeIcon className="w-4 h-4" />
                            Home
                        </button></Link>
                </div>
            </div>
        </div>
    )
}
