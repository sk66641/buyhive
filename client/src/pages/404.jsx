import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
            <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">404</p>
                <h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 mb-4">
                    Page not found
                </h1>
                <p className="text-gray-500 text-base sm:text-lg mb-8">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <Link
                    to="/"
                    className="inline-block rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-500 transition"
                >
                    Go back home
                </Link>
            </div>
        </main>
    );
}
