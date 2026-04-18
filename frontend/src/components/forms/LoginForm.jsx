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
            if (res.requiresOTP) {
                navigate('/verify-otp', { state: { email: res.email } });
            } else {
                // Role-based redirect
                const userRole = res.user?.role;
                if (userRole === 'manager') {
                    navigate('/manager/dashboard');
                } else if (userRole === 'admin') {
                    navigate('/admin/dashboard');
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
                <div className="border border-black bg-black text-white px-4 py-4 text-xs font-mono tracking-widest flex items-center mb-12 uppercase mix-blend-difference">
                    <span className="font-bold mr-3">[ERROR]</span> {error}
                </div>
            )}

            <div className="flex justify-center w-full mb-16 relative z-20">
                <div className="w-full border-[1.5px] border-black hover:bg-black transition-colors cursor-pointer relative overflow-hidden group">
                    <div className="relative z-10 p-1 group-hover:invert transition-all duration-300">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                setLoading(true);
                                setError("");
                                const res = await googleLogin(credentialResponse);
                                setLoading(false);
                                if (res.success) {
                                    if (res.requiresOTP) {
                                        navigate('/verify-otp', { state: { email: res.email } });
                                    } else {
                                        // Role-based redirect
                                        const userRole = res.user?.role;
                                        if (userRole === 'manager') {
                                            navigate('/manager/dashboard');
                                        } else if (userRole === 'admin') {
                                            navigate('/admin/dashboard');
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

            <div className="space-y-12">
                <div>
                    <label htmlFor="email-address" className="block font-mono text-[10px] sm:text-xs tracking-[0.3em] font-bold text-neutral-400 uppercase mb-2">
                        EMAIL_ADDRESS
                    </label>
                    <div className="relative group">
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            data-testid="email-input"
                            autoComplete="email"
                            required
                            className="block w-full bg-transparent border-b-[1.5px] border-black text-black placeholder-neutral-200 font-bold text-3xl sm:text-4xl focus:outline-none focus:border-b-[4px] py-4 transition-all rounded-none"
                            placeholder="TYPE HERE"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                        <div className="absolute right-0 bottom-6 w-3 h-3 bg-black opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label htmlFor="password" className="block font-mono text-[10px] sm:text-xs tracking-[0.3em] font-bold text-neutral-400 uppercase">
                            AUTHORIZATION_CODE
                        </label>
                        <Link to="/forgot-password" className="font-mono text-[9px] tracking-[0.2em] text-black border-b border-black hover:text-neutral-500 hover:border-neutral-500 transition-colors uppercase">
                            LOST CODE?
                        </Link>
                    </div>
                    <div className="relative group">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            data-testid="password-input"
                            autoComplete="current-password"
                            required
                            className="block w-full bg-transparent border-b-[1.5px] border-black text-black placeholder-neutral-200 font-bold text-3xl sm:text-4xl focus:outline-none focus:border-b-[4px] py-4 transition-all rounded-none pr-16"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                        <button
                            type="button"
                            className="absolute right-0 bottom-6 font-mono font-bold text-[10px] tracking-widest text-neutral-400 hover:text-black transition-colors uppercase bg-white px-2"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "HIDE" : "SHOW"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-20 mt-auto">
                <button
                    type="submit"
                    data-testid="submit-button"
                    disabled={loading}
                    className="w-full bg-black text-white font-mono font-bold text-[10px] sm:text-xs tracking-[0.4em] py-6 sm:py-8 uppercase transition-all duration-300 hover:bg-white hover:text-black border-2 border-black focus:outline-none disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
                >
                    {loading ? (
                        <span className="flex justify-center items-center gap-4">
                            <span className="w-2 h-2 bg-currentColor animate-ping"></span>
                            AUTHENTICATING
                        </span>
                    ) : (
                        <span>AUTHORIZE</span>
                    )}
                </button>
            </div>
        </form>
    );
}
