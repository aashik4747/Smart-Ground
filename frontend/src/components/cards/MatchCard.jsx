import { Link } from "react-router-dom";

export default function MatchCard({ match, isMyMatch = false }) {
    // Map backend fields to frontend expected names if needed, or just use backend names
    const joinedCount = match.joinedPlayers?.length || 0;
    const maxPlayers = match.requiredPlayers || 0;
    const isFull = match.status === 'closed' || joinedCount >= maxPlayers;
    const filledPercentage = Math.min(100, (joinedCount / maxPlayers) * 100);

    const getStatusConfig = (status) => {
        if (status === 'pending') return { text: 'Pending Admin Review', color: 'bg-amber-50 text-amber-600 border-amber-100' };
        if (status === 'rejected') return { text: 'Rejected', color: 'bg-red-50 text-red-600 border-red-100' };
        if (status === 'cancelled') return { text: 'Cancelled', color: 'bg-gray-100 text-gray-500 border-gray-200' };
        if (isFull || status === 'closed') return { text: 'Full / Closed', color: 'bg-gray-800 text-white border-gray-900' };
        if (status === 'open') return { text: 'Approved & Open', color: 'bg-green-50 text-green-600 border-green-100' };
        return { text: status.toUpperCase(), color: 'bg-blue-50 text-blue-600 border-blue-100' };
    };

    const statusConfig = getStatusConfig(match.status);

    const getActionButton = () => {
        if (isMyMatch) return { text: 'View Details', style: 'bg-indigo-600 hover:bg-indigo-700 text-white' };
        if (match.status === 'pending') return { text: 'Under Review', style: 'bg-amber-100 text-amber-700 pointer-events-none' };
        if (match.status === 'rejected') return { text: 'Unavailable', style: 'bg-red-50 text-red-400 pointer-events-none' };
        if (match.status === 'cancelled') return { text: 'Cancelled', style: 'bg-gray-200 text-gray-500 pointer-events-none' };
        if (isFull) return { text: 'Waitlist', style: 'bg-gray-800 hover:bg-gray-900 text-white' };
        return { text: 'Join', style: 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md' };
    };

    const actionBtn = getActionButton();

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shadow-inner">
                            {getSportIcon(match.sport)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{match.sport} Match</h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{match.difficulty || 'Casual'}</span>
                                <span>•</span>
                                <span>{match.time}</span>
                            </div>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConfig.color}`}>
                        {statusConfig.text}
                    </span>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-start text-gray-600 text-sm">
                        <span className="mr-3 mt-0.5 text-indigo-400">📍</span>
                        <span className="flex-1">{match.venue?.name || match.location || "Location TBD"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <span className="mr-3 text-indigo-400">📅</span>
                        {match.date ? new Date(match.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : "Date TBD"}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium">
                        <span>Players Joined</span>
                        <span>{joinedCount} / {maxPlayers}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-gray-800' : 'bg-indigo-500'}`}
                            style={{ width: `${filledPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex -space-x-3 overflow-hidden pl-1">
                    {[...Array(Math.min(3, joinedCount))].map((_, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                            {/* Assuming name is populated, use first letter */}
                            {match.joinedPlayers[i]?.name ? match.joinedPlayers[i].name.charAt(0) : "P"}
                        </div>
                    ))}
                    {(joinedCount) > 3 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 text-xs text-gray-600 font-bold">
                            +{(joinedCount) - 3}
                        </div>
                    )}
                </div>

                {match.status === 'pending' || match.status === 'rejected' || match.status === 'cancelled' ? (
                    <span className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm ${actionBtn.style}`}>
                        {actionBtn.text}
                    </span>
                ) : (
                    <Link
                        to={`/user/match/${match._id}`}
                        className={`inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm transition-all transform active:scale-95 ${actionBtn.style}`}
                    >
                        {actionBtn.text}
                    </Link>
                )}
            </div>
        </div>
    );
}

const getSportIcon = (sport) => {
    switch (sport?.toLowerCase()) {
        case 'football': return '⚽';
        case 'cricket': return '🏏';
        case 'basketball': return '🏀';
        case 'badminton': return '🏸';
        case 'tennis': return '🎾';
        case 'volleyball': return '🏐';
        default: return '🏅';
    }
};
