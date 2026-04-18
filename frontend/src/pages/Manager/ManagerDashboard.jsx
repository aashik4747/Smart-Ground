import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { getMyVenues } from "../../services/venueService";
import { getMyBookings } from "../../services/bookingService";
import { Link } from "react-router-dom";

export default function ManagerDashboard() {
    const [venues, setVenues] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch manager's venues
        getMyVenues()
            .then(res => {
                if (res.data.success) {
                    setVenues(res.data.venues);
                }
            })
            .catch(err => {
                console.error("Failed to fetch venues", err);
            })
            .finally(() => setLoading(false));

        // Fetch manager's bookings
        getMyBookings()
            .then(res => {
                if (res.data.success) {
                    setBookings(res.data.bookings);
                }
            })
            .catch(err => {
                console.error("Failed to fetch bookings", err);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
                    <p className="text-gray-600">Manage your venues and bookings</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">My Venues</h3>
                        <p className="text-3xl font-bold text-indigo-600">{venues.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Bookings</h3>
                        <p className="text-3xl font-bold text-green-600">{bookings.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
                        <p className="text-3xl font-bold text-purple-600">
                            ₹{bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/manager/add-venue"
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            Add New Venue
                        </Link>
                        <Link
                            to="/user/bookings"
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                        >
                            View Bookings
                        </Link>
                    </div>
                </div>

                {/* My Venues List */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">My Venues</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : venues.length > 0 ? (
                        <div className="space-y-4">
                            {venues.map(venue => (
                                <div key={venue._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                                        <p className="text-sm text-gray-500">{venue.address}, {venue.city}, {venue.state}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            ₹{venue.pricePerHour}/hour | {venue.sports?.join(", ")}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/manager/venues/${venue._id}/edit`}
                                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            to={`/manager/venues/${venue._id}/bookings`}
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                        >
                                            Bookings
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">You haven't added any venues yet.</p>
                            <Link
                                to="/manager/add-venue"
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Add Your First Venue
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
