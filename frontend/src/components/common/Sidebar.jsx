import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Sidebar({ role }) {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const adminLinks = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
        { name: "Users", path: "/admin/users", icon: "👥" },
        { name: "Venues", path: "/admin/venues", icon: "🏟️" },
        { name: "Stalls", path: "/admin/stalls", icon: "🏪" },
        { name: "Bookings", path: "/admin/bookings", icon: "📅" },
        { name: "Matches", path: "/admin/matches", icon: "⚽" },
        { name: "Payments", path: "/admin/payments", icon: "💳" },
        { name: "Analytics", path: "/admin/analytics", icon: "📈" },
    ];

    const managerLinks = [
        { name: "Dashboard", path: "/manager/dashboard", icon: "📊" },
        { name: "My Venues", path: "/manager/venues", icon: "🏟️" },
        { name: "Grounds", path: "/manager/grounds", icon: "⛳" },
        { name: "Slots", path: "/manager/slots", icon: "⏰" },
        { name: "Stalls", path: "/manager/stalls", icon: "🏪" },
        { name: "Bookings", path: "/manager/bookings", icon: "📅" },
        { name: "Matches", path: "/manager/matches", icon: "⚽" },
        { name: "Revenue", path: "/manager/revenue", icon: "💰" },
    ];

    const stallOwnerLinks = [
        { name: "Dashboard", path: "/stall/dashboard", icon: "📊" },
        { name: "My Stalls", path: "/stall/my-stalls", icon: "🏪" },
        { name: "Browse Events", path: "/stall/browse-events", icon: "🔍" },
        { name: "Request Stall", path: "/stall/request", icon: "📝" },
        { name: "Documents", path: "/stall/documents", icon: "📄" },
        { name: "Payments", path: "/stall/payments", icon: "💳" },
    ];

    const getLinks = () => {
        if (role === "ADMIN") return adminLinks;
        if (role === "VENUE_MANAGER") return managerLinks;
        if (role === "STALL_OWNER") return stallOwnerLinks;
        return [];
    };

    const links = getLinks();


    return (
        <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col transition-all duration-300">
            <div className="h-16 flex items-center justify-center border-b border-slate-800">
                <Link to="/" className="text-xl font-bold text-indigo-400 tracking-wider">
                    Smart Ground
                </Link>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <span className="mr-3 text-lg">{link.icon}</span>
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <span className="mr-3">🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
}
