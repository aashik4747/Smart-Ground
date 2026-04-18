import { useState } from "react";
import { setInitialUserRole } from "../../services/userService";
import { useNotification } from "../../context/NotificationContext";

export default function RoleSelectionModal({ user, onRoleSelected }) {
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const { addNotification } = useNotification();

    const handleRoleSelect = async (role) => {
        setLoading(true);
        setSelectedRole(role);
        try {
            const res = await setInitialUserRole(role);
            if (res.data.success) {
                addNotification("Role assigned successfully!", "success");
                // The parent component manages storing the new Auth data.
                onRoleSelected(res.data.user, res.data.token);
            }
        } catch (error) {
            console.error("Role selection failed", error);
            addNotification(error.response?.data?.message || "Failed to set role. Please try again.", "error");
            setSelectedRole(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full animate-fade-in-up border border-white">
                <div className="p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Welcome, {user?.name}!</h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
                        We're thrilled to have you here. To get started and customize your dashboard, please tell us how you plan to use the platform. <strong className="text-indigo-600 block mt-2">You can only choose this once.</strong>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Role */}
                        <button
                            onClick={() => handleRoleSelect("user")}
                            disabled={loading}
                            className={`group relative text-left rounded-2xl border-2 p-6 transition-all duration-300 transform active:scale-95 ${loading && selectedRole !== "user" ? "opacity-50 cursor-not-allowed" : ""} ${selectedRole === "user" ? "border-indigo-600 bg-indigo-50 shadow-md ring-4 ring-indigo-100" : "border-gray-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 bg-white"}`}
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏃‍♂️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">User</h3>
                            <p className="text-sm text-gray-500">I want to book venues, find matches, and join active games.</p>
                            {loading && selectedRole === "user" && (
                                <div className="absolute top-4 right-4">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                </div>
                            )}
                        </button>

                        {/* Manager Role */}
                        <button
                            onClick={() => handleRoleSelect("manager")}
                            disabled={loading}
                            className={`group relative text-left rounded-2xl border-2 p-6 transition-all duration-300 transform active:scale-95 ${loading && selectedRole !== "manager" ? "opacity-50 cursor-not-allowed" : ""} ${selectedRole === "manager" ? "border-indigo-600 bg-indigo-50 shadow-md ring-4 ring-indigo-100" : "border-gray-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 bg-white"}`}
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏪</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Manager</h3>
                            <p className="text-sm text-gray-500">I want to manage venues and oversee operations.</p>
                            {loading && selectedRole === "manager" && (
                                <div className="absolute top-4 right-4">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
