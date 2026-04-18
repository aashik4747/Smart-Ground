import LoginForm from "../../components/forms/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
    return (
        <div className="min-h-screen flex bg-slate-900 text-white selection:bg-indigo-500">
            {/* Left Side - Dark aesthetic */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center border-r border-slate-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 p-12 text-center">
                <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl mb-8">
                    <span className="text-6xl">⚽</span>
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">SMART GROUND</h2>
                <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">Your platform for booking sports grounds, finding matches, and connecting with athletes.</p>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-slate-900 pointer-events-none"></div>
                <div className="relative max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white tracking-wide">User Login</h2>
                        <p className="mt-2 text-sm text-slate-400 font-medium">
                            Staff? <Link to="/admin/login" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b border-transparent hover:border-indigo-300 pb-0.5">Access Admin Portal</Link>
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <LoginForm />

                        <div className="pt-6 border-t border-slate-700">
                            <p className="text-center text-slate-400 text-sm mb-4">
                                Don't have an account?
                            </p>
                            <Link
                                to="/register"
                                className="block w-full text-center py-3 border border-transparent text-sm font-bold uppercase tracking-wider rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
