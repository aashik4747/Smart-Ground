import { Link } from "react-router-dom";
import { useMemo } from "react";
import { getSportImage } from "../../utils/imageUtils";

export default function GroundCard({ ground }) {
    const displayImage = useMemo(() => {
        return getSportImage(ground.imageUrl, ground.sport, ground._id, ground.name);
    }, [ground.imageUrl, ground.sport, ground._id, ground.name]);

    // Get venue information from populated data
    const venueName = ground.venue?.name || 'Unknown Venue';
    const venueLocation = ground.venue?.location || ground.location || 'Location not available';
    const venueCity = ground.venue?.city || '';
    const venueState = ground.venue?.state || '';


    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={displayImage}
                    alt={ground.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm flex items-center">
                    <span className="mr-1">📍</span> {venueLocation}
                </div>
                <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                    {ground.sport}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{ground.name}</h3>
                    <span className="bg-green-50 text-green-700 border border-green-100 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">
                        Available
                    </span>
                </div>
                <p className="text-sm text-indigo-600 font-medium mb-3">{venueName}</p>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{ground.description || "Experience top-quality turf and facilities at this premium venue."}</p>
                {(venueCity || venueState) && (
                    <div className="flex items-center text-xs text-gray-400 mb-4">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {[venueCity, venueState].filter(Boolean).join(', ')}
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                        <span className="text-2xl font-extrabold text-gray-900">₹{ground.price || ground.pricePerHour}</span>
                        <span className="text-gray-400 text-sm font-medium ml-1">/ hour</span>
                    </div>
                    <Link
                        to={`/player/book-slot/${ground._id}`}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                    >
                        Book Slot
                    </Link>
                </div>
            </div>
        </div>
    );
}
