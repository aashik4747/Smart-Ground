import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await login(data);
        setLoading(false);

        if (res.success) {
            // Ensure only admins can use this portal
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (storedUser.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError("Access denied. You are not an administrator.");
                // Remove the unauthorized token
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        } else {
            setError(res.msg);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900 text-white selection:bg-indigo-500">
            {/* Left Side - Dark aesthetic */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center border-r border-slate-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 p-12 text-center">
                <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl mb-8">
                    <span className="text-6xl">🛡️</span>
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">ADMINISTRATIVE PORTAL</h2>
                <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">Secured terminal for platform administrators. Ensure you are on a trusted network before proceeding.</p>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-slate-900 pointer-events-none"></div>
                <div className="relative max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white tracking-wide">Enter Credentials</h2>
                        <p className="mt-2 text-sm text-slate-400 font-medium">
                            Not an admin? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b border-transparent hover:border-indigo-300 pb-0.5">Return to User Login</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {error && (
                            <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center shadow-inner">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Admin Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all focus:bg-slate-800"
                                        placeholder="admin@smartground.com"
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Security Key</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all focus:bg-slate-800"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-wider rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {loading ? "Authorizing..." : "Authenticate"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
