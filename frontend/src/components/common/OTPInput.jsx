import { useState, useRef, useEffect } from "react";

export default function OTPInput({ length = 6, onChange }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Submit trigger
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) {
            onChange(combinedOtp);
        }

        // Move to next input if current field is filled
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        // Optional: specific logic to focus first empty
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if empty
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="flex gap-2 sm:gap-4 justify-center">
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(input) => (inputRefs.current[index] = input)}
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 sm:w-12 sm:h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                />
            ))}
        </div>
    );
}
