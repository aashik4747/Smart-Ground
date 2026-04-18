import { useMemo } from "react";
import { getSportImage } from "../../utils/imageUtils";

export default function BookingCard({ booking }) {
    const statusColors = {
        PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
        CONFIRMED: "bg-green-50 text-green-700 border-green-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
        COMPLETED: "bg-gray-50 text-gray-700 border-gray-200"
    };

    const displayImage = useMemo(() => {
        return getSportImage(booking.ground?.imageUrl, booking.sport || booking.ground?.sport, booking.ground?._id);
    }, [booking.ground?.imageUrl, booking.sport, booking.ground?.sport, booking.ground?._id]);

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
            <div className="flex items-start spaces-x-0 sm:space-x-5 gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-inner relative">
                    <img
                        src={displayImage}
                        alt="Ground"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{booking.ground?.name || "Ground Name"}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-2">{booking.sport || "N/A"}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 gap-1 sm:gap-4">
                        <span className="flex items-center">
                            <span className="mr-1.5 opacity-70">📅</span>
                            {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <span className="flex items-center">
                            <span className="mr-1.5 opacity-70">⏰</span>
                            {booking.startTime} - {booking.endTime}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:min-w-[120px]">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[booking.status] || "bg-gray-50 text-gray-800 border-gray-200"}`}>
                    {booking.status}
                </span>
                <div className="text-right">
                    <div className="text-sm text-gray-400 mb-0.5">Total</div>
                    <span className="text-xl font-bold text-gray-900">₹{booking.price}</span>
                </div>
            </div>
        </div>
    );
}
