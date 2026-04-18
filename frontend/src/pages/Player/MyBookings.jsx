import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { getMyBookings } from "../../services/bookingService";
import { getMyMatches } from "../../services/matchService";
import BookingCard from "../../components/cards/BookingCard";
import MatchCard from "../../components/cards/MatchCard";
import { useNotification } from "../../context/NotificationContext";

export default function MyBookings() {
    const [combinedItems, setCombinedItems] = useState([]);
    const [filter, setFilter] = useState("ALL"); // ALL, UPCOMING, PAST
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bookingsRes, matchesRes] = await Promise.all([
                    getMyBookings().catch(() => ({ data: [] })),
                    getMyMatches().catch(() => ({ data: [] }))
                ]);

                const bookings = (bookingsRes.data || []).map(b => ({
                    ...b,
                    _type: 'booking',
                    _sortDate: new Date(b.date)
                }));
                
                const matches = (matchesRes.data || []).map(m => ({
                    ...m,
                    _type: 'match',
                    _sortDate: m.date ? new Date(m.date) : new Date()
                }));

                const combined = [...bookings, ...matches].sort((a, b) => b._sortDate - a._sortDate);
                setCombinedItems(combined);
            } catch (error) {
                console.error("Failed to fetch schedule:", error);
                addNotification("Failed to load your schedule.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [addNotification]);

    const filteredItems = combinedItems.filter(item => {
        // Filter by Status/Time
        let statusMatch = true;
        if (filter === "UPCOMING") {
            statusMatch = item._sortDate >= new Date();
        } else if (filter === "PAST") {
            statusMatch = item._sortDate < new Date();
        }

        // Filter by Search (Ground Name or Sport)
        const searchTarget = item._type === 'booking' 
            ? `${item.groundName || ''} ${item.sport || ''}`
            : `${item.location || item.venue?.name || ''} ${item.sport || ''}`;
            
        const searchMatch = !search || searchTarget.toLowerCase().includes(search.toLowerCase());

        return statusMatch && searchMatch;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 animate-fade-in-up">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Schedule</h2>
                        <p className="mt-2 text-gray-500">Track your venue bookings and joined matches all in one place.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search schedule..."
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="bg-gray-100 p-1 rounded-xl flex shadow-inner">
                            {["ALL", "UPCOMING", "PAST"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 justify-center flex items-center whitespace-nowrap ${filter === f
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                                        }`}
                                >
                                    {f.charAt(0) + f.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse font-medium">Loading your schedule...</p>
                        </div>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="space-y-6">
                        {filteredItems.map((item, index) => (
                            <div key={item._id + item._type} className="animate-fade-in-up transform hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                {item._type === 'booking' ? (
                                    <BookingCard booking={item} />
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-2 border-b border-gray-100 flex items-center justify-between">
                                            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Joined Match</span>
                                        </div>
                                        <div className="p-2">
                                            <MatchCard match={item} isMyMatch={true} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                        <div className="mx-auto h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Schedule Found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            {search
                                ? "No items match your search criteria."
                                : filter === "UPCOMING"
                                    ? "You don't have any upcoming games or bookings."
                                    : "You haven't made any bookings or joined any matches yet."}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="/player/grounds" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
                                Book a Venue
                            </a>
                            <a href="/player/matches" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 shadow-sm transition-all transform hover:-translate-y-1">
                                Join a Match
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

