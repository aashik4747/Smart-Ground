import { useState } from "react";
import { bookSlot } from "../../services/bookingService";
import { useNotification } from "../../context/NotificationContext";

export default function SlotBookingForm({ groundId, onSuccess }) {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [slot, setSlot] = useState({
        date: "",
        startTime: "",
        endTime: "",
    });

    const handleChange = (e) => {
        setSlot({ ...slot, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!process.env.TEST_MODE && new Date(`${slot.date}T${slot.startTime}`) < new Date()) {
            addNotification("Cannot book slots in the past.");
            return;
        }

        setLoading(true);
        try {
            await bookSlot(groundId, slot);
            addNotification("Slot booked successfully! Waiting for confirmation.");
            if (onSuccess) onSuccess();
            setSlot({ date: "", startTime: "", endTime: "" });
        } catch (error) {
            addNotification(error.response?.data?.message || "Failed to book slot");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Book a Slot</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                    type="date"
                    name="date"
                    value={slot.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        value={slot.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        value={slot.endTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2"
            >
                {loading ? "Processing..." : "Confirm Booking"}
            </button>
        </form>
    );
}
