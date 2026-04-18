import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";

export default function StallDashboard() {
    const [loading, setLoading] = useState(true);

    // Mock stats 
    const stats = {
        totalStalls: 3,
        activeApplications: 1,
        totalRevenue: 15000,
        upcomingEvents: 4
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) return <Loader />;

    return (
        <DashboardLayout
            role="STALL_OWNER"
            title="Stall Owner Dashboard"
            description="Manage your stalls, track applications, and monitor revenue."
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
                <StatCard
                    title="My Stalls"
                    value={stats.totalStalls}
                    icon="🏪"
                    color="bg-gradient-to-r from-orange-400 to-orange-600"
                    textColor="text-orange-600"
                    delay="0"
                />
                <StatCard
                    title="Active Applications"
                    value={stats.activeApplications}
                    icon="📝"
                    color="bg-gradient-to-r from-blue-400 to-blue-600"
                    textColor="text-blue-600"
                    delay="100"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon="💰"
                    color="bg-gradient-to-r from-green-400 to-green-600"
                    textColor="text-green-600"
                    delay="200"
                />
                <StatCard
                    title="Upcoming Events"
                    value={stats.upcomingEvents}
                    icon="🎉"
                    color="bg-gradient-to-r from-purple-400 to-purple-600"
                    textColor="text-purple-600"
                    delay="300"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up animation-delay-300">
                {/* Find Opportunities Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-center items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Find New Opportunities</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">Browse upcoming events in stadiums near you and request a stall to boost your business.</p>
                    <a href="/stall/browse-events" className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 font-medium">
                        Browse Events
                    </a>
                </div>

                {/* Recent Activity Placeholder - To be connected to real data */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Recent Notifications</h3>
                    <div className="flex-grow flex flex-col justify-center items-center space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl w-full flex items-start space-x-3">
                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs">✅</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Stall Request Approved</p>
                                <p className="text-xs text-gray-500">Your stall for "City Cricket Final" has been approved.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl w-full flex items-start space-x-3">
                            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs">⚠️</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Document Expiry Warning</p>
                                <p className="text-xs text-gray-500">Your Trade License will expire in 15 days.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, icon, color, textColor, delay }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg" style={{ animationDelay: `${delay}ms` }}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mr-4 shadow-md ${color}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
                <p className={`text-2xl font-extrabold ${textColor}`}>{value}</p>
            </div>
        </div>
    );
}

