export default function StallCard({ stall, onApprove }) {
    const statusColors = {
        PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
        APPROVED: "bg-green-50 text-green-700 border-green-200",
        REJECTED: "bg-red-50 text-red-700 border-red-200"
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{stall.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[stall.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {stall.status}
                    </span>
                </div>

                <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium w-16 text-gray-400">Owner:</span>
                        <span className="text-gray-900">{stall.ownerName}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium w-16 text-gray-400">Event:</span>
                        <span className="text-indigo-600 font-medium">{stall.eventName}</span>
                    </p>
                </div>
            </div>

            {stall.status === "PENDING" && onApprove && (
                <button
                    onClick={() => onApprove(stall._id)}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Approve Request
                </button>
            )}
        </div>
    );
}
