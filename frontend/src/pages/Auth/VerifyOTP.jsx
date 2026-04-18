import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";
import OTPInput from "../../components/common/OTPInput";

export default function VerifyOTP() {
    const { verifyOTP } = useAuth();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            addNotification("Email not found. Please register again.", "error");
            navigate("/register");
        }
    }, [email, navigate, addNotification]);

    const handleVerify = async (otpValue) => {
        setLoading(true);
        setError("");

        const res = await verifyOTP({ email, otp: otpValue });
        setLoading(false);

        if (res.success) {
            addNotification("Verification successful! You can now access your dashboard.", "success");
            navigate("/dashboard");
        } else {
            setError(res.msg);
            addNotification(res.msg, "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Verify your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We have sent a verification code to your email.
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm text-center mb-6 flex items-center justify-center border border-red-100 animate-shake">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-center mb-6">
                                Enter 6-digit code
                            </label>
                            <OTPInput length={6} onChange={(otp) => {
                                if (otp.length === 6) handleVerify(otp);
                            }} />
                        </div>

                        <div className="text-sm text-center">
                            <p className="text-gray-500 mb-2">Didn't receive the code?</p>
                            <button className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                Resend OTP
                            </button>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-indigo-600 font-medium">Verifying...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

