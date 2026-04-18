import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllStalls } from "../../services/adminService";

export default function AdminStalls() {
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllStalls().then(data => {
            setStalls(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout role="ADMIN" title="Stalls Ledger" description="Approve and monitor physical vendor spaces deployed across venues.">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                {loading ? <div className="p-10"><Loader /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-bold">Event Setup</th>
                                    <th className="px-6 py-4 font-bold">Owner</th>
                                    <th className="px-6 py-4 font-bold">Price</th>
                                    <th className="px-6 py-4 font-bold text-center">Clearance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stalls.map(s => (
                                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{s.eventName}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold">{s.owner?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">{s.owner?.email || ''}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{s.price}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${s.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {s.approved ? 'Approved' : 'Pending Request'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stalls.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-gray-500">No Stalls deployed currently.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
