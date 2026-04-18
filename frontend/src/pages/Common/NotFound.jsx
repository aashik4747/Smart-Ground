import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="max-w-max mx-auto text-center">
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide animate-fade-in">404 error</p>
                    <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl animate-fade-in-up">
                        Page not found.
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 animate-fade-in-up animation-delay-200">
                        Sorry, we couldn’t find the page you’re looking for.
                    </p>
                    <div className="mt-6 flex justify-center gap-4 animate-fade-in-up animation-delay-400">
                        <Link to="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                            Go back home<span aria-hidden="true"> &rarr;</span>
                        </Link>
                        <Link to="/contact" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                            Contact support<span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </div>

                    {/* Visual Element */}
                    <div className="mt-12 animate-fade-in-up animation-delay-500 opacity-50">
                        <svg className="mx-auto h-40 w-40 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
