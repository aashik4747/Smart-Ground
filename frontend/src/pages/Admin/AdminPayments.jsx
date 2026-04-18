import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Loader from "../../components/common/Loader";
import { getAllPayments } from "../../services/adminService";

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllPayments().then(data => {
            setPayments(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const totalVolume = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <DashboardLayout role="ADMIN" title="Financial Ledger" description="Gateway logs and overarching payment surveillance.">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-3xl">💰</div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Gross Volume</p>
                        <h3 className="text-3xl font-black text-gray-900">₹{totalVolume.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl text-3xl">🔄</div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Processed Transactions</p>
                        <h3 className="text-3xl font-black text-gray-900">{payments.length}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
                {loading ? <div className="p-10"><Loader /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-bold">Transaction ID</th>
                                    <th className="px-6 py-4 font-bold">Payer Account</th>
                                    <th className="px-6 py-4 font-bold">Amount</th>
                                    <th className="px-6 py-4 font-bold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map(p => (
                                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono text-gray-400">{p._id}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{p.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{p.user?.email || ''}</p>
                                        </td>
                                        <td className="px-6 py-4 font-black text-emerald-600 text-lg">₹{p.amount?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${p.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                                {p.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-gray-500">No Payments found in the system.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
