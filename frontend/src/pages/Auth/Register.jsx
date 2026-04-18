import RegisterForm from "../../components/forms/RegisterForm";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 xl:p-24 font-sans selection:bg-black selection:text-white relative overflow-hidden">
            
            {/* Extremely subtle hairline grid overlay for architectural feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-50 pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[1300px] flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24 relative z-10"
            >
                {/* Left Side: Massive High-Fashion Typography */}
                <div className="w-full lg:w-1/2 lg:pt-10 flex flex-col justify-between h-full">
                    <div>
                        <h1 className="text-[5rem] sm:text-[7rem] lg:text-[8rem] xl:text-[9rem] font-black tracking-tighter leading-[0.8] mb-12 uppercase text-black break-words">
                            CREATE<br/>ID.
                        </h1>
                        <div className="w-full h-[2px] bg-black mb-8"></div>
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start text-sm gap-4 sm:gap-0">
                            <span className="font-mono tracking-widest uppercase text-xs font-bold text-black">SMART GROUND SYSTEM</span>
                            <span className="font-mono tracking-widest uppercase text-xs text-neutral-400 font-bold">REGISTRATION // 2026</span>
                        </div>
                        <p className="mt-12 max-w-sm text-neutral-600 font-medium leading-relaxed font-mono text-xs sm:text-sm tracking-wide">
                            Generate a new secure identity profile to reserve venues and manage community interactions.
                        </p>
                    </div>

                    <div className="mt-20 lg:mt-32 xl:mt-40 flex flex-col gap-6">
                         <Link to="/login" className="group flex items-center justify-between border-b-2 border-black pb-4 hover:opacity-50 transition-opacity w-full max-w-sm">
                             <span className="font-bold uppercase tracking-widest text-xs font-mono text-black">RETURN TO ENTRY</span>
                             <span className="group-hover:-translate-x-2 transition-transform text-black flex items-center justify-center">←</span>
                         </Link>
                    </div>
                </div>

                {/* Right Side: Brutal Minimal Form */}
                <div className="w-full lg:w-1/2 max-w-[550px] lg:pt-4">
                    <RegisterForm />
                </div>
            </motion.div>
        </div>
    );
}

