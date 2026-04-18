import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import useAuth from "../../hooks/useAuth";

const QuickActionCard = ({ title, desc, link, icon, color }) => (
    <Link to={link} className="block group">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 h-full relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-8 -translate-y-8 rounded-full ${color} opacity-10 group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
            <div className="relative z-10">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
            </div>
        </div>
    </Link>
);

export default function Home() {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow">
                {/* Welcome Header */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Welcome back, {user?.name?.split(' ')[0] || 'Player'}!
                                </h1>
                                <p className="text-gray-500 mt-1">Here's what's happening with your sports activities.</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <Link 
                                    to="/player/grounds" 
                                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                >
                                    Book Venue
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Upcoming Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">📅</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Matches</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">⚽</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Reliability Score</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">98%</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">⭐</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Spent</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">$450</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">💰</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <QuickActionCard
                                title="Book Venue"
                                desc="Find and book sports grounds"
                                link="/player/grounds"
                                icon="🏟️"
                                color="bg-blue-500"
                            />
                            <QuickActionCard
                                title="Find Matches"
                                desc="Join or create matches"
                                link="/player/matches"
                                icon="⚽"
                                color="bg-green-500"
                            />
                            <QuickActionCard
                                title="My Bookings"
                                desc="View upcoming and past bookings"
                                link="/player/bookings"
                                icon="📅"
                                color="bg-purple-500"
                            />
                            <QuickActionCard
                                title="Profile"
                                desc="Manage your account settings"
                                link="/player/profile"
                                icon="👤"
                                color="bg-orange-500"
                            />
                        </div>
                    </div>

                    {/* Upcoming Booking */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Upcoming Booking</h2>
                            <Link to="/player/bookings" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                                View All
                            </Link>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <span className="text-3xl">🏟️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Elite Sports Arena</h3>
                                        <p className="text-sm text-gray-500">Football • Alpha Pitch</p>
                                        <p className="text-sm text-gray-500 mt-1">Tomorrow, 10:00 AM - 12:00 PM</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">$40</p>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Confirmed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">✅</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-900">Booking confirmed at Elite Sports Arena</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">⚽</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-900">Joined match "Weekend Football Derby"</p>
                                    <p className="text-xs text-gray-500">Yesterday</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">📅</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-900">Completed booking at Greenfield Stadium</p>
                                    <p className="text-xs text-gray-500">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}



