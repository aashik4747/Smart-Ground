import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../services/api";
import { getMatchDetails, joinMatch, leaveMatch, cancelMatch } from "../../services/matchService";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

export default function MatchDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { user } = useAuth();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                setLoading(true);
                const res = await getMatchDetails(id);
                setMatch(res.data);
            } catch (error) {
                console.error("Failed to fetch match details", error);
                addNotification("Failed to load match details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [id, addNotification]);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    // Instead of straight-to-API, we intercept requiring payment confirmation
    // Instead of straight-to-API, we intercept requiring payment confirmation
    const triggerJoin = () => {
        if (isFull) {
            handleJoin(); // Bypass payment for waitlist
        } else if (match.pricePerPlayer > 0) {
            setShowPaymentModal(true);
        } else {
            handleJoin();
        }
    };

    const handleJoin = async () => {
        setActionLoading(true);
        try {
            await joinMatch(id);
            addNotification(
                isFull ? "You have been added to the waitlist!" : 
                (match.pricePerPlayer > 0 && !isFull) ? `Payment successful! You joined for ₹${match.pricePerPlayer}.` : "You have joined the match!", 
                "success"
            );
            setShowPaymentModal(false);
            const res = await getMatchDetails(id);
            setMatch(res.data);
        } catch (error) {
            console.error("Failed to join match", error);
            addNotification(error.response?.data?.message || "Failed to join match. Please try again.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!window.confirm("Are you sure you want to leave this match?")) return;
        setActionLoading(true);
        try {
            await leaveMatch(id);
            addNotification("You have left the match.", "success");
            const res = await getMatchDetails(id);
            setMatch(res.data);
        } catch (error) {
            console.error("Failed to leave match", error);
            addNotification(error.response?.data?.message || "Failed to leave match.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this match? This action cannot be undone.")) return;
        setActionLoading(true);
        try {
            await cancelMatch(id);
            addNotification("Match has been cancelled.", "success");
            navigate("/player/my-matches");
        } catch (error) {
            console.error("Failed to cancel match", error);
            addNotification(error.response?.data?.message || "Failed to cancel match.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleFollow = async (playerId, currentlyFollowing) => {
        try {
            if (currentlyFollowing) {
                await api.post(`/users/${playerId}/unfollow`);
                addNotification("Unfollowed player", "info");
            } else {
                await api.post(`/users/${playerId}/follow`);
                addNotification("Following player!", "success");
            }
            
            // Re-fetch match to instantly display updated followers accurately
            const res = await getMatchDetails(id);
            setMatch(res.data);
        } catch (error) {
            addNotification("Failed to modify network map", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <Footer />
        </div>
    );

    if (!match) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex justify-center items-center">
                <p className="text-gray-500 text-lg">Match not found.</p>
            </div>
            <Footer />
        </div>
    );

    const joinedCount = match.joinedPlayers?.length || 0;
    const maxPlayers = match.requiredPlayers || 0;
    const isFull = joinedCount >= maxPlayers;
    const progress = (joinedCount / maxPlayers) * 100;

    // Auth checks
    // Auth checks
    const userId = user?._id || user?.id;
    const isHost = match.host?._id === userId;
    const isJoined = match.joinedPlayers?.some(p => p._id === userId);
    const isWaitlisted = match.waitlistedPlayers?.some(p => p._id === userId || p === userId);
    const isCancelled = match.status === "cancelled";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {isCancelled && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100 font-medium">
                        This match has been cancelled by the host.
                    </div>
                )}

                {/* Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 animate-fade-in-up">
                    <div className="bg-indigo-900 h-32 sm:h-48 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-800 opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-2 border border-white/10 uppercase tracking-wider">
                                {match.sport}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{match.location || "Venue TBA"}</h1>
                            {match.host && <p className="text-indigo-200">Hosted by {match.host.name}</p>}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span className="font-medium text-lg">
                                        {match.date ? new Date(match.date).toLocaleDateString() : "Date TBD"} {match.time ? `at ${match.time}` : ""}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <span>{match.location}</span>
                                </div>
                                {match.description && (
                                    <p className="text-gray-500 text-sm mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        "{match.description}"
                                    </p>
                                )}
                            </div>

                            <div className="w-full md:w-80 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">Player Slots</span>
                                    <span className="text-sm font-bold text-indigo-600">{joinedCount} / {maxPlayers}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                                </div>

                                {!isCancelled && (
                                    <>
                                        {isHost ? (
                                            <button
                                                onClick={handleCancel}
                                                disabled={actionLoading}
                                                className="w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all text-white bg-red-600 hover:bg-red-700 shadow-red-200 disabled:opacity-50"
                                            >
                                                {actionLoading ? 'Processing...' : 'Cancel Match'}
                                            </button>
                                        ) : isJoined || isWaitlisted ? (
                                            <button
                                                onClick={handleLeave}
                                                disabled={actionLoading}
                                                className="w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-50"
                                            >
                                                {actionLoading ? 'Processing...' : isWaitlisted ? 'Leave Waitlist' : 'Leave Match'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={triggerJoin}
                                                disabled={actionLoading}
                                                className={`w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                                                    isFull
                                                    ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                                                }`}
                                            >
                                                {actionLoading 
                                                    ? 'Processing...' 
                                                    : isFull 
                                                    ? 'Join Waitlist' 
                                                    : match.pricePerPlayer > 0 
                                                    ? `Pay ₹${match.pricePerPlayer} to Join` 
                                                    : 'Join Match (Free)'}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Players List */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-200 mb-12">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex gap-4 items-center">
                            <h3 className="text-lg font-bold text-gray-900">Players Joined ({joinedCount}/{maxPlayers})</h3>
                            {match.waitlistedPlayers?.length > 0 && (
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                                    {match.waitlistedPlayers.length} on Waitlist
                                </span>
                            )}
                        </div>
                        {match.pricePerPlayer > 0 && (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-200">
                                Entry: ₹{match.pricePerPlayer}
                            </span>
                        )}
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {match.joinedPlayers?.length > 0 ? (
                            match.joinedPlayers.map((player) => {
                                const isCurrentUser = player._id === userId;
                                const isFollowing = player.followers?.includes(userId);

                                return (
                                <li key={player._id} className="px-8 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 shadow-sm">
                                            {player.profileImage ? (
                                                <img src={player.profileImage} className="w-full h-full object-cover"/>
                                            ) : (
                                                player.name ? player.name.charAt(0).toUpperCase() : "U"
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                {player.name || "Unknown User"}
                                                {match.host?._id === player._id && <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md uppercase font-black">Host</span>}
                                            </p>
                                            <p className="text-xs text-indigo-500 font-mono font-bold mt-0.5">{player.turfId || "No TurfID"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex gap-4 text-center">
                                            <div>
                                                <div className="text-sm font-black text-gray-700">{player.reliabilityScore || 100}</div>
                                                <div className="text-[9px] uppercase font-bold text-gray-400">Reliability</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-700">{player.followers?.length || 0}</div>
                                                <div className="text-[9px] uppercase font-bold text-gray-400">Followers</div>
                                            </div>
                                        </div>
                                        {!isCurrentUser && (
                                            <button 
                                                onClick={() => handleFollow(player._id, isFollowing)}
                                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${isFollowing ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}`}
                                            >
                                                {isFollowing ? 'Unfollow' : 'Follow'}
                                            </button>
                                        )}
                                    </div>
                                </li>
                                );
                            })
                        ) : (
                            <li className="px-8 py-8 text-center text-gray-500">
                                No players have joined yet. Be the first!
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Split Payment Modal Simulator */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="bg-indigo-600 p-6 text-white text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-4 border-2 border-white/30">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold">Checkout: Join Match</h2>
                            <p className="text-indigo-100 mt-2 opacity-90">Host is requesting a split to confirm your spot.</p>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6">
                                <span className="text-gray-500 font-medium">Split Amount</span>
                                <span className="text-2xl font-black text-gray-900">₹{match.pricePerPlayer}</span>
                            </div>

                            <button
                                onClick={handleJoin}
                                disabled={actionLoading}
                                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2 mb-4"
                            >
                                {actionLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    "Confirm Payment"
                                )}
                            </button>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                disabled={actionLoading}
                                className="w-full py-3 rounded-xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                                Payments are securely simulated for this demo iteration.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
