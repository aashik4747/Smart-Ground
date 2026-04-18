import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "./Loader";

export default function ProtectedRoute({ roles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Force user to set Turf ID in profile page if they don't have one
    if (user.role === 'player' && !user.turfId && location.pathname !== '/player/profile') {
        return <Navigate to="/player/profile" replace state={{ mandateTurfId: true }} />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
