import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllMatches, approveMatch, rejectMatch } from "../../services/adminService";

export default function AdminMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllMatches().then(data => {
            setMatches(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleApprove = async (id) => {
        try {
            await approveMatch(id);
            setMatches(matches.map(m => m._id === id ? { ...m, status: 'open' } : m));
        } catch (e) {
            console.error('Failed to approve match', e);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectMatch(id);
            setMatches(matches.map(m => m._id === id ? { ...m, status: 'rejected' } : m));
        } catch (e) {
            console.error('Failed to reject match', e);
        }
    };

    return (
        <DashboardLayout role="ADMIN" title="Match Oversight" description="Monitor peer-to-peer match formations system-wide.">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                {loading ? <div className="p-10"><Loader /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-bold">Sport</th>
                                    <th className="px-6 py-4 font-bold">Host</th>
                                    <th className="px-6 py-4 font-bold">Roster</th>
                                    <th className="px-6 py-4 font-bold">Location</th>
                                    <th className="px-6 py-4 font-bold text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {matches.map(m => (
                                    <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${m.sport === 'Football' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{m.sport}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold">{m.host?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                            {m.joinedPlayers?.length || 0} / {m.requiredPlayers} Filled
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{m.location}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                                m.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 
                                                m.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                                m.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                m.status === 'closed' ? 'bg-red-100 text-red-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {m.status === 'open' ? 'APPROVED' : m.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {m.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(m._id)} className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors">Approve</button>
                                                    <button onClick={() => handleReject(m._id)} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors">Reject</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {matches.length === 0 && <tr><td colSpan="6" className="text-center p-8 text-gray-500">No Matches Found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
