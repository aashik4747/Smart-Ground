import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Unauthorized() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="max-w-max mx-auto text-center">
                    <p className="text-sm font-semibold text-red-600 uppercase tracking-wide animate-fade-in">403 Forbidden</p>
                    <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl animate-fade-in-up">
                        Access Denied.
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 animate-fade-in-up animation-delay-200">
                        You do not have permission to access this page.
                    </p>
                    <div className="mt-6 flex justify-center gap-4 animate-fade-in-up animation-delay-400">
                        <Link to="/" className="base-btn bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                            Go back home
                        </Link>
                        <Link to="/login" className="base-btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all shadow-sm">
                            Login with different account
                        </Link>
                    </div>
                    {/* Visual Element */}
                    <div className="mt-12 animate-fade-in-up animation-delay-500 opacity-50">
                        <svg className="mx-auto h-40 w-40 text-red-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
