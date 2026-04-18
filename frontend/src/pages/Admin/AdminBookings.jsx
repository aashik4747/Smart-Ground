import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllBookings } from "../../services/adminService";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllBookings().then(data => {
            setBookings(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="ADMIN" title="System Bookings" description="Master ledger tracking cross-platform pitch allocations.">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                {loading ? <div className="p-10"><Loader /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-bold">Booking ID</th>
                                    <th className="px-6 py-4 font-bold">Player</th>
                                    <th className="px-6 py-4 font-bold">Timestamp</th>
                                    <th className="px-6 py-4 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{b._id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{b.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-indigo-600">{b.user?.email || ''}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(b.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${b.status === 'confirmed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                                {b.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-gray-500">No Bookings Found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
