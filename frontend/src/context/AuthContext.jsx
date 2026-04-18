import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, verifyOTP as verifyOTPService, forgotPassword as forgotPasswordService, logoutUser as logoutUserService, googleLoginUser, updateTurfIdAPI } from "../services/authService";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (data) => {
        try {
            const res = await loginUser(data);
            if (res.data.requiresOTP) {
                return { success: true, requiresOTP: true, email: res.data.email };
            }
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user);
                return { success: true };
            }
            return { success: false, msg: "Invalid response from server" };
        } catch (error) {
            return { success: false, msg: error.response?.data?.message || "Login failed" };
        }
    };

    const googleLogin = async (data) => {
        try {
            const res = await googleLoginUser(data);
            if (res.data.requiresOTP) {
                return { success: true, requiresOTP: true, email: res.data.email };
            }
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user);
                return { success: true };
            }
            return { success: false, msg: "Invalid response from server" };
        } catch (error) {
            return { success: false, msg: error.response?.data?.message || "Google Authentication failed" };
        }
    };

    const register = async (data) => {
        try {
            const res = await registerUser(data);
            return { success: true, msg: res.data.message || "Registration successful" };
        } catch (error) {
            return { success: false, msg: error.response?.data?.message || "Registration failed" };
        }
    };

    const verifyOTP = async (data) => {
        try {
            const res = await verifyOTPService(data);
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user);
                return { success: true };
            }
            return { success: true, msg: "Verification successful. Please login." };
        } catch (error) {
            return { success: false, msg: error.response?.data?.message || "Verification failed" };
        }
    };

    const forgotPassword = async (data) => {
        try {
            const res = await forgotPasswordService(data);
            return { success: true, msg: res.data.message || "Reset link sent" };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Request failed";
            return { success: false, msg: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await logoutUserService();
        } catch (error) {
            console.error("Logout error", error);
        }
        localStorage.removeItem("user");
        setUser(null);
    };

    const updateUser = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const setupTurfId = async (turfId) => {
        try {
            const res = await updateTurfIdAPI({ turfId });
            if (res.data.user) {
                // Update local storage and context state
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user);
                return { success: true, msg: "Turf ID set successfully", user: res.data.user };
            }
            return { success: false, msg: "Invalid response from server" };
        } catch (error) {
            return { success: false, msg: error.response?.data?.message || "Failed to set Turf ID" };
        }
    };

    const value = {
        user,
        loading,
        login,
        googleLogin,
        register,
        verifyOTP,
        forgotPassword,
        logout,
        setupTurfId
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
