import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
    const { login, googleLogin } = useAuth();
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
            // Get user from localStorage since login response doesn't include user object
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const userRole = storedUser.role;

            // Prevent admins from using regular login page
            if (userRole === 'admin') {
                setError("Administrators must use the dedicated portal at /admin/login");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                return;
            }

            if (res.requiresOTP) {
                navigate('/verify-otp', { state: { email: res.email } });
            } else {
                // Role-based redirect
                if (userRole === 'manager') {
                    navigate('/manager/dashboard');
                } else if (userRole === 'user') {
                    navigate('/user/home');
                } else {
                    navigate('/dashboard'); // Fallback
                }
            }
        } else {
            setError(res.msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center shadow-inner mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {error}
                </div>
            )}

            <div className="space-y-5">
                <div className="flex justify-center mb-6">
                    <div className="w-full border border-slate-600 hover:border-slate-500 transition-colors rounded-xl overflow-hidden">
                        <div className="p-1">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    setLoading(true);
                                    setError("");
                                    const res = await googleLogin(credentialResponse);
                                    setLoading(false);
                                    if (res.success) {
                                        // Get user from localStorage since login response doesn't include user object
                                        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                                        const userRole = storedUser.role;

                                        // Prevent admins from using regular login page
                                        if (userRole === 'admin') {
                                            setError("Administrators must use the dedicated portal at /admin/login");
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("user");
                                            return;
                                        }

                                        if (res.requiresOTP) {
                                            navigate('/verify-otp', { state: { email: res.email } });
                                        } else {
                                            // Role-based redirect
                                            if (userRole === 'manager') {
                                                navigate('/manager/dashboard');
                                            } else if (userRole === 'user') {
                                                navigate('/user/home');
                                            } else {
                                                navigate('/dashboard'); // Fallback
                                            }
                                        }
                                    } else {
                                        setError(res.msg);
                                    }
                                }}
                                onError={() => {
                                    console.error('Login Failed');
                                    setError("GOOGLE SIGN-IN FAILED");
                                }}
                                theme="outline"
                                size="large"
                                shape="square"
                                width="100%"
                                text="continue_with"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-800 text-slate-400">or continue with email</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <input
                            type="email"
                            required
                            className="block w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all focus:bg-slate-800"
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">Password</label>
                        <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                            Forgot password?
                        </Link>
                    </div>
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-wider rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
            </div>
        </form>
    );
}
