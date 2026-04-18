import { useEffect, useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { getAllMatches } from "../../services/matchService";
import { Link } from "react-router-dom";
import { getSportImage } from "../../utils/imageUtils";

export default function BrowseEvents() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sportFilter, setSportFilter] = useState("ALL");

    useEffect(() => {
        if (typeof getAllMatches === 'function') {
            getAllMatches()
                .then(res => {
                    setEvents(res?.data || []);
                    setFilteredEvents(res?.data || []);
                })
                .catch(() => {
                    setEvents([]);
                    setFilteredEvents([]);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let result = events;

        // Search Filter
        if (search) {
            result = result.filter(e =>
                e.name?.toLowerCase().includes(search.toLowerCase()) ||
                e.venue?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sport Filter
        if (sportFilter !== "ALL") {
            result = result.filter(e => e.sport === sportFilter);
        }

        setFilteredEvents(result);
    }, [search, sportFilter, events]);

    return (
        <DashboardLayout
            role="STALL_OWNER"
            title="Browse Events"
            description="Find high-traffic events to boost your sales."
        >
            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center animate-fade-in-up">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search events or venues..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {["ALL", "Cricket", "Football", "Badminton"].map(sport => (
                        <button
                            key={sport}
                            onClick={() => setSportFilter(sport)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${sportFilter === sport
                                    ? "bg-indigo-600 text-white shadow-md transform scale-105"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {sport}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-500 animate-pulse font-medium">Loading upcoming events...</p>
                    </div>
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event, index) => (
                        <div key={event._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <img
                                    src={getSportImage(event.imageUrl, event.sport, event._id)}
                                    alt={event.sport}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <span className="bg-indigo-600 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1 inline-block shadow-sm">
                                        {event.sport}
                                    </span>
                                    <h3 className="text-xl font-bold leading-tight">{event.name || `${event.sport} Match`}</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <span className="w-8 flex justify-center text-lg mr-2">📅</span>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Date</p>
                                            <p className="text-sm font-medium">{event.date ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Upcoming"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <span className="w-8 flex justify-center text-lg mr-2">📍</span>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Venue</p>
                                            <p className="text-sm font-medium">{event.venue?.name || "Venue TBD"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <span className="w-8 flex justify-center text-lg mr-2">👥</span>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Est. Crowd</p>
                                            <p className="text-sm font-medium">{event.maxPlayers ? `${event.maxPlayers * 50}+ Attendees` : "Unknown"}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/stall/request?eventId=${event._id}`}
                                    className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-indigo-500/30"
                                >
                                    Request a Stall
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                    <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">📅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        {search ? "No events match your search criteria. Try a different term." : "There are currently no upcoming events available for stall bookings."}
                    </p>
                    {search && (
                        <button
                            onClick={() => { setSearch(""); setSportFilter("ALL"); }}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}

