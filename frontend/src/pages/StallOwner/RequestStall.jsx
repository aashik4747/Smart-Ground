import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import { requestStall } from "../../services/stallService";
import { useNotification } from "../../context/NotificationContext";

export default function RequestStall() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [eventId, setEventId] = useState(searchParams.get("eventId") || "");
    const [stallType, setStallType] = useState("Merchandise"); // Default
    const [stallName, setStallName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (typeof requestStall === 'function') {
                await requestStall({ eventId, stallType, name: stallName, description });
            }
            addNotification("Stall request submitted successfully!", "success");
            navigate("/stall/my-stalls");
        } catch (e) {
            console.error(e);
            addNotification("Request failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout
            role="STALL_OWNER"
            title="Request Stall"
            description="Submit a proposal to set up a stall at an event."
        >
            <div className="max-w-2xl mx-auto animate-fade-in-up">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-600 px-8 py-6">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <span className="mr-3 text-2xl">📝</span> New Stall Proposal
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1 opacity-90">Fill in the details below to request a stall.</p>
                    </div>

                    <form onSubmit={handleRequest} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Event ID</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={eventId}
                                        onChange={e => setEventId(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                        placeholder="Enter Event ID"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">🆔</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5 ml-1">You can find this ID in the 'Browse Events' section.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Stall Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={stallName}
                                            onChange={e => setStallName(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                            placeholder="e.g., Best Burgers"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400">🏪</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Stall Type</label>
                                    <div className="relative">
                                        <select
                                            value={stallType}
                                            onChange={e => setStallType(e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none"
                                        >
                                            <option value="Merchandise">Merchandise</option>
                                            <option value="Food & Beverage">Food & Beverage</option>
                                            <option value="Service">Service</option>
                                            <option value="Promotion">Promotion</option>
                                        </select>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400">🏷️</span>
                                        </div>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white h-32 resize-none"
                                    placeholder="Describe what you will be selling or offering..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Submitting Proposal...
                                    </>
                                ) : (
                                    <>
                                        🚀 Submit Stall Request
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                By submitting, you agree to the venue's stall allocation terms and conditions.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

