import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { getMyMatches } from "../../services/matchService";
import MatchCard from "../../components/cards/MatchCard";
import { useNotification } from "../../context/NotificationContext";

export default function MyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const res = await getMyMatches();
                setMatches(res.data || []);
            } catch (error) {
                console.error("Failed to fetch matches:", error);
                addNotification("Failed to load your matches.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [addNotification]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 animate-fade-in-up">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Matches</h2>
                        <p className="mt-2 text-gray-500">Games you are hosting or have joined.</p>
                    </div>
                    <a href="/player/matches" className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                        Browse More Matches
                    </a>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse">Loading your matches...</p>
                        </div>
                    </div>
                ) : matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {matches.map((m, index) => (
                            <div key={m._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <MatchCard match={m} isMyMatch={true} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                        <div className="mx-auto h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Matches Found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            You haven't joined or hosted any matches yet.
                        </p>
                        <a href="/player/grounds" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            Create a Match Request
                        </a>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
