import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { getMyStalls } from "../../services/stallService";

export default function MyStalls() {
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof getMyStalls === 'function') {
            getMyStalls()
                .then(res => setStalls(res?.data || []))
                .catch(() => setStalls([]))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const renderActions = (
        <a href="/stall/browse-events" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5">
            <span className="mr-2 text-lg">+</span> Request New Stall
        </a>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return '✅';
            case 'REJECTED': return '❌';
            default: return '⏳';
        }
    };

    return (
        <DashboardLayout
            role="STALL_OWNER"
            title="My Stalls"
            description="Track and manage your requested stalls."
            actions={renderActions}
        >
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-500 animate-pulse font-medium">Loading your stalls...</p>
                    </div>
                </div>
            ) : stalls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {stalls.map((stall, index) => (
                        <div key={stall._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
                            {/* Card Header with Event Image Fallback */}
                            <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 relative p-6 flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="text-6xl">🏪</span>
                                </div>
                                <div>
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{stall.type} Stall</span>
                                    <h3 className="text-white font-bold text-lg mt-1 truncate">{stall.event?.sport || "General Event"}</h3>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="px-6 -mt-4 flex justify-between items-end">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center shadow-sm ${getStatusColor(stall.status)}`}>
                                    <span className="mr-1.5">{getStatusIcon(stall.status)}</span>
                                    {stall.status || "PENDING"}
                                </span>
                            </div>

                            <div className="p-6 pt-4">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                        <span className="text-gray-500">Location</span>
                                        <span className="font-medium text-gray-900">{stall.event?.location || "TBD"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                        <span className="text-gray-500">Event Date</span>
                                        <span className="font-medium text-gray-900">{stall.event?.date || "Upcoming"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Stall Name</span>
                                        <span className="font-medium text-gray-900 truncate max-w-[150px]">{stall.name || "My Stall"}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 border border-indigo-100 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200 rounded-xl font-bold transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                    <div className="mx-auto h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">🏪</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stalls Found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        You haven't requested any stalls yet. Browse upcoming events to set up your first stall!
                    </p>
                    <a href="/stall/browse-events" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
                        Browse Events
                    </a>
                </div>
            )}
        </DashboardLayout>
    );
}

