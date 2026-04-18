import { useState } from "react";
import { createMatchRequest } from "../../services/matchService";
import { useNotification } from "../../context/NotificationContext";

export default function MatchRequestForm({ onSuccess }) {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        sport: "",
        location: "",
        date: "",
        time: "",
        maxPlayers: 10,
        difficulty: "Casual"
    });

    const sports = ["Football", "Cricket", "Basketball", "Badminton", "Tennis", "Volleyball"];
    const difficulties = ["Casual", "Competitive", "Pro"];

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createMatchRequest(data);
            addNotification("Match request created successfully!");
            if (onSuccess) onSuccess();
            setData({ sport: "", location: "", date: "", time: "", maxPlayers: 10, difficulty: "Casual" });
        } catch (error) {
            addNotification(error.response?.data?.message || "Failed to create match request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                    <select
                        name="sport"
                        value={data.sport}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    >
                        <option value="">Select Sport</option>
                        {sports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                        name="difficulty"
                        value={data.difficulty}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    >
                        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    name="location"
                    value={data.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. City Stadium, Field 5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={data.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                        type="time"
                        name="time"
                        value={data.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
                    <input
                        type="number"
                        name="maxPlayers"
                        value={data.maxPlayers}
                        onChange={handleChange}
                        min="2"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Match...
                    </>
                ) : (
                    "Create Match Request"
                )}
            </button>
        </form>
    );
}
