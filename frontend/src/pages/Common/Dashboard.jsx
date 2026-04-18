import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import RoleSelectionModal from "../../components/common/RoleSelectionModal";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // If role is pending, do NOT navigate away. The component will render the Modal below.
        if (user.role === "pending") {
            return;
        }

        // Role-based redirection with fallback
        switch (user.role) {

            case "manager":
                navigate("/manager/dashboard");
                break;
            case "stallOwner":
                navigate("/stall/dashboard");
                break;
            case "player":
                navigate("/player/home");
                break;
            default:
                // Fallback for unknown roles or missing role data
                console.warn("Unknown user role:", user.role);
                navigate("/"); // Redirect to home page safely
                break;
        }
    }, [user, navigate]);

    const handleRoleAssigned = (updatedUser, newToken) => {
        // We'll trust the AuthContext (which you might map to update localStorage/state) 
        // Or directly do a window reload for a hard fresh state, but let's try pushing it to context if possible
        // Actually, just updating localStorage and reloading is the safest immediate bet to refresh all app state cleanly
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("token", newToken);
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
            {user?.role === "pending" && (
                <RoleSelectionModal user={user} onRoleSelected={handleRoleAssigned} />
            )}
            <Loader text="Redirecting to your dashboard..." />
        </div>
    );
}
