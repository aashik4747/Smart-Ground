import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { getAllMatches } from "../../services/matchService";
import MatchCard from "../../components/cards/MatchCard";
import { useNotification } from "../../context/NotificationContext";

export default function BrowseMatches() {
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sportFilter, setSportFilter] = useState("All");
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const res = await getAllMatches();
                const data = res.data || [];
                setMatches(data);
                setFilteredMatches(data);
            } catch (error) {
                console.error("Failed to fetch matches:", error);
                addNotification("Failed to load matches. Please try again later.", "error");
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [addNotification]);

    useEffect(() => {
        let results = matches;

        if (search) {
            results = results.filter(m =>
                m.location.toLowerCase().includes(search.toLowerCase()) ||
                m.sport.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sportFilter !== "All") {
            results = results.filter(m => m.sport === sportFilter);
        }

        setFilteredMatches(results);
    }, [search, sportFilter, matches]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 opacity-90"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up">
                        Find Your Perfect Match
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-indigo-100 mb-10 animate-fade-in-up animation-delay-200">
                        Join existing games, meet new players, and enjoy the sport you love.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2 animate-fade-in-up animation-delay-400">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by location or sport..."
                                className="block w-full pl-10 pr-3 py-3 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-900 placeholder-gray-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            className="w-full md:w-48 px-4 py-3 border-none rounded-xl bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                            value={sportFilter}
                            onChange={(e) => setSportFilter(e.target.value)}
                        >
                            <option value="All">All Sports</option>
                            <option value="Cricket">Cricket</option>
                            <option value="Football">Football</option>
                            <option value="Badminton">Badminton</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Basketball">Basketball</option>
                        </select>

                        <button className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg flex-shrink-0">
                            Search
                        </button>
                        
                        <a href="/player/grounds" className="w-full md:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg text-center flex items-center justify-center whitespace-nowrap flex-shrink-0">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Create Match
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse">Loading matches...</p>
                        </div>
                    </div>
                ) : filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {filteredMatches.map((m, index) => (
                            <div key={m._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <MatchCard match={m} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                        <div className="mx-auto h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Matches Found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            {search || sportFilter !== "All"
                                ? "Try adjusting your filters to see more results."
                                : "It seems quiet right now. Be the first to start a game!"}
                        </p>
                        <a href="/player/grounds" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Create a Match Request
                        </a>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

