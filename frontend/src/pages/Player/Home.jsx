import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import useAuth from "../../hooks/useAuth";

const FeatureCard = ({ title, desc, link, icon, color, delay }) => (
    <Link to={link} className={`block group animate-fade-in-up`} style={{ animationDelay: delay }}>
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full relative overflow-hidden transform hover:-translate-y-2">
            <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-10 -translate-y-10 rounded-full ${color} opacity-10 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-8 translate-y-8 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors duration-500"></div>

            <div className="relative z-10">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-lg">{desc}</p>
            </div>

            <div className="mt-8 flex items-center text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <span>Explore Now</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
        </div>
    </Link>
);

const StepCard = ({ number, title, desc }) => (
    <div className="flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-6 relative">
            {number}
            <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-20"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 max-w-xs">{desc}</p>
    </div>
);

export default function Home() {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow">
                {/* Hero Section */}
                <div className="relative bg-indigo-900 text-white overflow-hidden min-h-[85vh] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                            alt="Sports Stadium"
                            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900/90 to-black/80"></div>
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-56 flex flex-col items-center text-center">
                        <span className="inline-block py-2 px-4 rounded-full bg-indigo-800/50 border border-indigo-500/30 text-indigo-200 text-sm font-bold tracking-widest uppercase mb-8 animate-fade-in backdrop-blur-sm">
                            The Ultimate Sports Platform
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-fade-in-up leading-tight">
                            Welcome, {user?.name?.split(' ')[0] || 'Player'}! <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Game On.</span>
                        </h1>
                        <p className="max-w-2xl text-xl md:text-2xl text-indigo-100/90 mb-12 leading-relaxed animate-fade-in-up animation-delay-200 font-light">
                            Book top-rated venues, find matches, and join a community of sports enthusiasts. Your next game is just a click away.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-fade-in-up animation-delay-400">
                            <Link to="/player/grounds" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1">
                                Book a Venue
                                <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                            </Link>
                            <Link to="/player/matches" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-indigo-900 transition-all duration-200 bg-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Find Matches
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature Cards - Overlapping Hero */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Search Venues"
                            desc="Find the perfect venue for your next match. Filter by sport, location, and amenities."
                            link="/player/grounds"
                            color="bg-blue-500"
                            icon="🏟️"
                            delay="0ms"
                        />
                        <FeatureCard
                            title="Browse Matches"
                            desc="Looking for a team? Browse existing matches and request to join them instantly."
                            link="/player/matches"
                            color="bg-green-500"
                            icon="⚽"
                            delay="200ms"
                        />
                        <FeatureCard
                            title="My Bookings"
                            desc="Manage your upcoming games, view booking history, and track metrics."
                            link="/player/bookings"
                            color="bg-purple-500"
                            icon="📅"
                            delay="400ms"
                        />
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                How It Works
                            </h2>
                            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                                Get started in three simple steps.
                            </p>
                        </div>

                        <div className="relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <StepCard
                                    number="1"
                                    title="Find a Spot"
                                    desc="Search for venues near you or browse available match slots."
                                />
                                <StepCard
                                    number="2"
                                    title="Book Instantly"
                                    desc="Select your time, confirm your details, and pay securely online."
                                />
                                <StepCard
                                    number="3"
                                    title="Play & Enjoy"
                                    desc="Show up at the venue, verify your booking, and have a great game."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white py-24 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 text-center">
                            <div className="p-8 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
                                <div className="text-6xl font-black text-indigo-600 mb-2 tracking-tighter">500+</div>
                                <div className="text-lg font-semibold text-gray-600 uppercase tracking-wide">Premium Venues</div>
                            </div>
                            <div className="p-8 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-colors">
                                <div className="text-6xl font-black text-purple-600 mb-2 tracking-tighter">2k+</div>
                                <div className="text-lg font-semibold text-gray-600 uppercase tracking-wide">Matches Organized</div>
                            </div>
                            <div className="p-8 rounded-2xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
                                <div className="text-6xl font-black text-pink-600 mb-2 tracking-tighter">10k+</div>
                                <div className="text-lg font-semibold text-gray-600 uppercase tracking-wide">Active Players</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}



