import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { bookSlot } from "../../services/bookingService";
import { getGroundDetails } from "../../services/groundService";
import { useNotification } from "../../context/NotificationContext";

export default function BookSlot() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [ground, setGround] = useState(null);
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [sport, setSport] = useState("");
    const [loading, setLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]); // newly added component

    // Match Request Integration Variables
    const [hostMatch, setHostMatch] = useState(false);
    const [requiredPlayers, setRequiredPlayers] = useState("");
    const [pricePerPlayer, setPricePerPlayer] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    // Fetch existing booked slots when Date changes!
    useEffect(() => {
        if (!date || !id) return;

        // basic fetch request avoiding Axios config conflicts if missing manually
        fetch(`http://localhost:5000/api/bookings/slots?groundId=${id}&date=${date}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.bookedTimes) {
                    setBookedSlots(data.bookedTimes);
                }
            })
            .catch(err => console.error(err));
    }, [date, id]);

    useEffect(() => {
        getGroundDetails(id)
            .then(res => {
                setGround(res.data);
                if (res.data.sport) setSport(res.data.sport);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();

        // Conflict validation checker natively BEFORE submit
        const potentialSlot = `${startTime} - ${endTime}`;
        if (bookedSlots.includes(potentialSlot)) {
            addNotification("This exact time slot is already booked! Please select another time.", "error");
            return;
        }

        if (hostMatch) {
            if (!requiredPlayers || parseInt(requiredPlayers) < 2) {
                addNotification("A match requires at least 2 players.", "warning");
                return;
            }
            if (!pricePerPlayer || Number(pricePerPlayer) < 0) {
                addNotification("Please specify a valid price per joining player.", "warning");
                return;
            }
        }

        setLoading(true);
        try {
            await bookSlot({
                groundId: id,
                date,
                startTime,
                endTime,
                sport,
                hostMatch,
                requiredPlayers: hostMatch ? parseInt(requiredPlayers) : undefined,
                pricePerPlayer: hostMatch ? Number(pricePerPlayer) : undefined,
                isPrivate: hostMatch ? isPrivate : undefined
            });
            addNotification("Slot booked successfully!", "success");
            navigate('/player/my-bookings');
        } catch (e) {
            console.error("Booking failed:", e);
            addNotification(e.response?.data?.message || "Booking failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white">Book {ground?.name || "Your Slot"}</h2>
                            <p className="text-indigo-100 mt-2 text-lg">
                                {ground?.venue?.name ? `${ground.venue.name}, ${ground.venue.location}` : "Reserve your venue and get ready to play."}
                            </p>
                            {ground?.pricePerHour && (
                                <p className="text-white mt-4 font-bold text-xl">₹{ground.pricePerHour} / hour</p>
                            )}
                        </div>
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    <form onSubmit={handleBooking} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sport</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-sm"
                                    onChange={e => setSport(e.target.value)}
                                >
                                    <option value="">Select Sport</option>
                                    <option value="Cricket">Cricket</option>
                                    <option value="Football">Football</option>
                                    <option value="Badminton">Badminton</option>
                                    <option value="Tennis">Tennis</option>
                                    <option value="Basketball">Basketball</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                    onChange={e => setStartTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                                <input
                                    type="time"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                    onChange={e => setEndTime(e.target.value)}
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                        checked={hostMatch}
                                        onChange={e => setHostMatch(e.target.checked)}
                                    />
                                    <div>
                                        <div className="font-bold text-indigo-900">Host as a Community Match</div>
                                        <div className="text-sm text-indigo-700">Allow other players on the platform to discover and join your slot.</div>
                                    </div>
                                </label>
                            </div>

                            {hostMatch && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Max Players Needed</label>
                                        <input
                                            type="number"
                                            min="2"
                                            required={hostMatch}
                                            placeholder="e.g. 10"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                            onChange={e => setRequiredPlayers(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Join Price Per Player (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            required={hostMatch}
                                            placeholder="e.g. 150"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm border-l-4 border-l-green-500"
                                            onChange={e => setPricePerPlayer(e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Match Privacy</label>
                                        <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors mt-1 max-w-sm">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                checked={isPrivate}
                                                onChange={e => setIsPrivate(e.target.checked)}
                                            />
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">Private Match</div>
                                                <div className="text-xs text-gray-500">Only your followers can see this match.</div>
                                            </div>
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>

                        {bookedSlots.length > 0 && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <h4 className="text-orange-800 font-bold text-sm mb-2">Unavailable Booked Times on {date}:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {bookedSlots.map((slotTime, idx) => (
                                        <span key={idx} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md font-semibold">{slotTime}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Confirm Booking'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}

