import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAdminStats, getVenueManagerStats } from "../../services/adminService";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [venueStats, setVenueStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [userData, venueData] = await Promise.all([
                    getAdminStats(),
                    getVenueManagerStats()
                ]);
                setStats(userData);
                setVenueStats(venueData);
                setLoading(false);
            } catch (err) {
                setError("Failed to load admin stats");
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <DashboardLayout
            role="ADMIN"
            title="Admin Dashboard"
            description="Manage all users and monitor platform statistics securely."
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon="👥"
                    color="bg-gradient-to-r from-blue-500 to-indigo-600"
                    delay="0"
                />
                <StatCard
                    title="Players"
                    value={stats?.players || 0}
                    icon="🏃"
                    color="bg-gradient-to-r from-emerald-400 to-teal-500"
                    delay="100"
                />
                <StatCard
                    title="Stall Owners"
                    value={stats?.stallOwners || 0}
                    icon="🏪"
                    color="bg-gradient-to-r from-pink-500 to-rose-600"
                    delay="200"
                />
                <StatCard
                    title="Total Venues"
                    value={venueStats?.totalVenues || 0}
                    icon="🏟️"
                    color="bg-gradient-to-r from-amber-400 to-orange-500"
                    delay="300"
                />
            </div>

            {/* Venue Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up animation-delay-100">
                <StatCard
                    title="Total Grounds"
                    value={venueStats?.totalGrounds || 0}
                    icon="⛳"
                    color="bg-gradient-to-r from-green-400 to-green-600"
                    delay="0"
                />
                <StatCard
                    title="Approved Venues"
                    value={venueStats?.approvedVenues || 0}
                    icon="✅"
                    color="bg-gradient-to-r from-blue-400 to-blue-600"
                    delay="100"
                />
                <StatCard
                    title="Pending Venues"
                    value={venueStats?.pendingVenues || 0}
                    icon="⏳"
                    color="bg-gradient-to-r from-yellow-400 to-yellow-600"
                    delay="200"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-fade-in-up animation-delay-200">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onClick={() => window.location.href = '/admin/users?role=player'} className="w-full flex items-center justify-between p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group cursor-pointer">
                            <span className="font-semibold text-indigo-700">Manage Players</span>
                            <span className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">View ➝</span>
                        </button>
                        <button onClick={() => window.location.href = '/admin/venues'} className="w-full flex items-center justify-between p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group cursor-pointer">
                            <span className="font-semibold text-emerald-700">Manage Venues</span>
                            <span className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">View ➝</span>
                        </button>
                        <button onClick={() => window.location.href = '/admin/grounds'} className="w-full flex items-center justify-between p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group cursor-pointer">
                            <span className="font-semibold text-amber-700">Manage Grounds</span>
                            <span className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">View ➝</span>
                        </button>
                        <button onClick={() => window.location.href = '/admin/users?role=stallOwner'} className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors group cursor-pointer">
                            <span className="font-semibold text-rose-700">Manage Stall Owners</span>
                            <span className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">View ➝</span>
                        </button>
                    </div>
                </div>

                {/* Info Panel Placeholder */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Pending Approvals</span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm">{stats?.pending || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-700 font-medium">System Security</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-sm flex items-center">
                                <span className="mr-1 text-xs">🔒</span> Helmet & Rate-Limiting Active
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Admin Accounts</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">{stats?.admins || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, icon, color, delay }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg" style={{ animationDelay: `${delay}ms` }}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mr-4 shadow-md ${color}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
