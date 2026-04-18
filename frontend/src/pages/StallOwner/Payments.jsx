import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { getStallPayments } from "../../services/paymentService";

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof getStallPayments === 'function') {
            getStallPayments()
                .then(res => setPayments(res?.data || []))
                .catch(() => setPayments([]))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <DashboardLayout
            role="STALL_OWNER"
            title="Payment History"
            description="Track your payment history for stall rentals."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Paid</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">₹45,000</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                        💰
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Next Due</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">₹15,000</h3>
                        <p className="text-xs text-red-500 mt-1 font-medium bg-red-50 inline-block px-2 py-0.5 rounded-full">Due in 5 days</p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl">
                        ⏳
                    </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">Upcoming Payment</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-2xl font-bold">Stall Rental</h3>
                            <p className="text-indigo-100 text-sm">City Cricket Final</p>
                        </div>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm">
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-200">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-gray-900 font-bold text-lg">Transaction History</h3>
                    <button className="text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                        <span className="mr-2">📥</span> Download Statement
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse text-sm">Loading transactions...</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.length > 0 ? payments.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}</td>
                                        <td className="px-8 py-5 whitespace-nowrap text-gray-900">
                                            <div className="text-sm font-bold">{p.description || "Stall Rental Fee"}</div>
                                            <div className="text-xs text-gray-400">ID: {p._id.substr(0, 8)}</div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm font-extrabold text-gray-900">₹{p.amount?.toLocaleString()}</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${p.status === 'COMPLETED' || p.status === 'SUCCESS' ? 'bg-green-100 text-green-700 border-green-200' :
                                                p.status === 'FAILED' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {p.status || "COMPLETED"}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    // Mock row if empty
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">2023-10-15</td>
                                        <td className="px-8 py-5 whitespace-nowrap text-gray-900">
                                            <div className="text-sm font-bold">Stall Deposit - Cricket Final</div>
                                            <div className="text-xs text-gray-400">ID: #TXN-88392</div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm font-extrabold text-gray-900">₹15,000</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-700 border border-green-200">
                                                SUCCESS
                                            </span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

