import LoginForm from "../../components/forms/LoginForm";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Side - Hero Section */}
            <div className="lg:w-1/2 relative overflow-hidden hidden lg:flex flex-col justify-center items-center p-12">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.15)_0%,transparent_50%)]"></div>
                </div>
                
                <div className="relative z-10 text-center max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="text-8xl mb-4">⚽</div>
                        <h1 className="text-5xl font-black mb-4 tracking-tight">
                            Smart Ground
                        </h1>
                        <p className="text-xl text-indigo-200">
                            Stadium & Venue Booking System
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-center gap-4 text-indigo-200">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🏟️</span>
                            </div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🏃</span>
                            </div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🏆</span>
                            </div>
                        </div>
                        <p className="text-sm text-indigo-300 font-medium">
                            Book sports grounds, find matches, and join the community
                        </p>
                    </motion.div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                    animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-20 left-20 text-4xl opacity-50"
                >
                    🏐
                </motion.div>
                <motion.div
                    animate={{ 
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-32 right-32 text-4xl opacity-50"
                >
                    🎾
                </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white/10 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="text-5xl mb-2">⚽</div>
                        <h1 className="text-3xl font-black text-white">Smart Ground</h1>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-500">Sign in to your account to continue</p>
                        </div>

                        <LoginForm />

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-gray-500 text-sm mb-4">
                                Don't have an account?
                            </p>
                            <Link
                                to="/register"
                                className="block w-full text-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
                            >
                                Create Account
                            </Link>
                            <Link
                                to="/admin/login"
                                className="block w-full text-center mt-3 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                            >
                                Staff Portal →
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-indigo-200 text-xs mt-6">
                        © 2026 Smart Ground. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
