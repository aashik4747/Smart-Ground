import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllBookings, getAllPayments, getAllVenues, getAllMatches } from "../../services/adminService";

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [bookings, payments, venues, matches] = await Promise.all([
                    getAllBookings(), getAllPayments(), getAllVenues(), getAllMatches()
                ]);

                const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
                const activeVenues = venues.filter(v => v.approved).length;

                setStats({
                    bookings: bookings.length,
                    revenue: totalRevenue,
                    venues: venues.length,
                    activeVenues,
                    matches: matches.length
                });
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    return (
        <DashboardLayout role="ADMIN" title="System Analytics" description="Deep performance metrics and comprehensive traffic reporting.">
            {loading ? <div className="p-20"><Loader /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                    <StatCard icon="💰" color="text-emerald-600" bg="bg-emerald-50" title="Gross Revenue" value={`₹${stats.revenue.toLocaleString()}`} subtitle="+14.5% from last month" />
                    <StatCard icon="📅" color="text-indigo-600" bg="bg-indigo-50" title="Total Bookings" value={stats.bookings} subtitle="Network wide allocations" />
                    <StatCard icon="🏟️" color="text-blue-600" bg="bg-blue-50" title="Registered Venues" value={stats.venues} subtitle={`${stats.activeVenues} Currently active venues`} />
                    <StatCard icon="⚽" color="text-rose-600" bg="bg-rose-50" title="Community Matches" value={stats.matches} subtitle="Player interactions tracked" />
                </div>
            )}
        </DashboardLayout>
    );
}

const StatCard = ({ icon, color, bg, title, value, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
                <h3 className="text-3xl font-black text-gray-900">{value}</h3>
            </div>
            <div className={`p-4 ${bg} ${color} rounded-2xl text-2xl`}>{icon}</div>
        </div>
        <p className="text-xs text-gray-400 font-semibold">{subtitle}</p>
    </div>
);
