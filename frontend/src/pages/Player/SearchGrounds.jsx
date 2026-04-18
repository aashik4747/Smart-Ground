import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { getAllVenues } from "../../services/venueService";
import { INDIA_STATES_CITIES } from "../../utils/indiaLocations";
import { PageLoader, CardLoader } from "../../components/common/EnhancedLoader";
import { SearchInput, FilterChip, SortDropdown, Pagination } from "../../components/common/EnhancedSearch";
import { Container, Grid, EmptyState } from "../../components/common/ResponsiveLayout";
import { FadeIn, SlideUp, StaggeredChildren } from "../../components/common/Animations";
import { useToast } from "../../components/common/Toast";
import { SPORT_CONFIGS } from "../../utils/sportImageGenerator";
import { Link } from "react-router-dom";
import { getSportImage } from "../../utils/imageUtils";

export default function SearchGrounds() {
    const [venues, setVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [sportFilter, setSportFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("name");
    const [useLocation, setUseLocation] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [maxDistance, setMaxDistance] = useState(50); // Default 50km
    const { success, error: showError } = useToast();

    const itemsPerPage = 9;

    const sportsCategories = [
        { name: "All", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&q=80" },
        { name: "Football", image: "https://images.unsplash.com/photo-1518605368461-1ee7c5cd1536?w=500&q=80" },
        { name: "Cricket", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&q=80" },
        { name: "Badminton", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80" },
        { name: "Tennis", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500&q=80" },
        { name: "Basketball", image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80" }
    ];

    const states = Object.keys(INDIA_STATES_CITIES);
    const cities = selectedState ? INDIA_STATES_CITIES[selectedState] : [];

    // Get user's geolocation
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setUseLocation(true);
                    success("Location detected! Showing nearby venues.");
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    showError("Could not get your location. Please enable location services.");
                    setUseLocation(false);
                }
            );
        } else {
            showError("Geolocation is not supported by your browser.");
        }
    };

    // Enhanced search with debouncing
    const debouncedSearch = useCallback(
        useMemo(() => {
            const timer = setTimeout(() => {
                setLoading(true);
                // Fetch venues with location-based search if enabled
                const lat = useLocation && userLocation ? userLocation.lat : null;
                const lng = useLocation && userLocation ? userLocation.lng : null;
                
                getAllVenues(
                    search, 
                    selectedState, 
                    selectedCity, 
                    sportFilter === "All" ? null : sportFilter,
                    lat,
                    lng,
                    maxDistance
                )
                    .then(res => {
                        const data = res.data || [];
                        setVenues(data);
                        setError(null);
                        if (data.length === 0 && (search || selectedState || selectedCity || sportFilter !== "All" || useLocation)) {
                            showError("No venues found matching your criteria");
                        }
                    })
                    .catch(err => {
                        console.error("Failed to fetch venues", err);
                        setError("Failed to load venues. Please try again.");
                        setVenues([]);
                        showError("Failed to load venues");
                    })
                    .finally(() => setLoading(false));
            }, 500); // 500ms debounce

            return () => clearTimeout(timer);
        }, [search, selectedState, selectedCity, sportFilter, useLocation, userLocation, maxDistance, showError]),
        [search, selectedState, selectedCity, sportFilter, useLocation, userLocation, maxDistance, showError]
    );

    useEffect(() => {
        debouncedSearch();
    }, [debouncedSearch]);

    useEffect(() => {
        // Filter venues based on sport (already filtered in backend, but this ensures client-side filtering too)
        if (sportFilter === "All") {
            setFilteredVenues(venues);
        } else {
            // Only show venues that have grounds matching the selected sport
            const filtered = venues.filter(venue => 
                venue.grounds?.some(g => g.sport?.toLowerCase() === sportFilter.toLowerCase())
            );
            setFilteredVenues(filtered);
        }
    }, [venues, sportFilter]);

    const clearFilters = () => {
        setSearch("");
        setSelectedState("");
        setSelectedCity("");
        setSportFilter("All");
        setUseLocation(false);
        setUserLocation(null);
        success("Filters cleared");
    };

    // Helper function to get venue display image
    const getVenueImage = (venue) => {
        // Use first ground's image if available, otherwise generate based on venue sports
        if (venue.grounds && venue.grounds.length > 0) {
            const firstGround = venue.grounds[0];
            return getSportImage(firstGround.imageUrl, firstGround.sport, firstGround._id, firstGround.name);
        }
        // Fallback to generic sports image
        return getSportImage(null, venue.sports?.[0], venue._id, venue.name);
    };

    // Generate search suggestions based on available sports and locations
    const searchSuggestions = useMemo(() => {
        const suggestions = [];
        
        // Add sport suggestions
        Object.keys(SPORT_CONFIGS).forEach(sport => {
            suggestions.push(sport.charAt(0).toUpperCase() + sport.slice(1));
        });
        
        // Add location suggestions from states
        states.slice(0, 10).forEach(state => {
            suggestions.push(state);
        });
        
        return suggestions;
    }, [states]);

    const handleSuggestionSelect = (suggestion) => {
        setSearch(suggestion);
        success(`Searching for "${suggestion}"`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-indigo-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-800 opacity-90"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up">
                        Find the Perfect Venue
                    </h1>
                    <p className="max-w-xl text-lg text-indigo-100 mb-8 animate-fade-in-up animation-delay-200">
                        Discover and book top-rated sports venues near you. From cricket pitches to football turfs.
                    </p>

                    {/* Search & Filters */}
                    <div className="w-full max-w-4xl relative animate-fade-in-up animation-delay-400">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-4">
                            <div className="flex-grow">
                                <SearchInput
                                    value={search}
                                    onChange={setSearch}
                                    suggestions={searchSuggestions}
                                    onSuggestionSelect={handleSuggestionSelect}
                                    placeholder="Search by name, location, or sport..."
                                    loading={loading}
                                    className="w-full"
                                />
                            </div>
                            
                            <select
                                className="px-4 py-3 rounded-xl bg-white text-gray-800 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none min-w-[160px] cursor-pointer"
                                value={selectedState}
                                onChange={(e) => {
                                    setSelectedState(e.target.value);
                                    setSelectedCity(""); // Reset city when state changes
                                }}
                            >
                                <option value="">All States</option>
                                {states.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>

                            <select
                                className={`px-4 py-3 rounded-xl bg-white text-gray-800 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none min-w-[160px] ${!selectedState ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                disabled={!selectedState}
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location-based search controls */}
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <button
                                onClick={getUserLocation}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${useLocation ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{useLocation ? 'Location ON' : 'Use My Location'}</span>
                            </button>

                            {useLocation && (
                                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                                    <span className="text-white text-sm">Max Distance:</span>
                                    <select
                                        value={maxDistance}
                                        onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                                        className="bg-white text-gray-800 rounded px-2 py-1 text-sm"
                                    >
                                        <option value="10">10 km</option>
                                        <option value="25">25 km</option>
                                        <option value="50">50 km</option>
                                        <option value="100">100 km</option>
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={clearFilters}
                                className="text-white/80 hover:text-white text-sm underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>

                    {/* Sports Image Slider */}
                    <div className="w-full max-w-5xl mt-12 animate-fade-in-up animation-delay-500">
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {sportsCategories.map((sport) => (
                                <div 
                                    key={sport.name}
                                    onClick={() => setSportFilter(sport.name)}
                                    className={`relative flex-shrink-0 w-32 md:w-40 h-24 md:h-28 rounded-2xl overflow-hidden cursor-pointer snap-center transition-all duration-300 ${sportFilter === sport.name ? 'ring-4 ring-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                >
                                    <div className={`absolute inset-0 z-10 transition-colors ${sportFilter === sport.name ? 'bg-indigo-900/40' : 'bg-black/50 hover:bg-black/30'}`}></div>
                                    <img src={sport.image} alt={sport.name} className="absolute inset-0 w-full h-full object-cover" />
                                    <span className="absolute inset-0 flex items-center justify-center text-white font-black tracking-wider text-sm md:text-base z-20 drop-shadow-md uppercase pointer-events-none">
                                        {sport.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Available Sports Tags */}
                    {sportFilter === "All" && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <span className="text-sm text-white/80">Available Sports:</span>
                            {Object.keys(SPORT_CONFIGS).slice(0, 6).map(sport => (
                                <span key={sport} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {error ? (
                    <div className="text-center py-20">
                        <div className="mx-auto h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <CardLoader key={index} />
                        ))}
                    </div>
                ) : filteredVenues.length > 0 ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">
                                Found <span className="font-semibold text-gray-900">{filteredVenues.length}</span> venues
                                {filteredVenues.reduce((total, v) => total + (v.grounds?.length || 0), 0) > 0 && (
                                    <span className="ml-2">
                                        with {filteredVenues.reduce((total, v) => total + (v.grounds?.length || 0), 0)} grounds
                                    </span>
                                )}
                            </p>
                            <div className="flex items-center gap-4">
                                <SortDropdown
                                    options={[
                                        { value: 'name', label: 'Name' },
                                        { value: 'location', label: 'Location' }
                                    ]}
                                    value={sortBy}
                                    onChange={setSortBy}
                                />
                            </div>
                        </div>
                        
                        <StaggeredChildren staggerDelay={100}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {filteredVenues.map((venue, index) => (
                                    <SlideUp key={venue._id} delay={index * 100}>
                                        {/* Venue Card */}
                                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                            {/* Venue Header Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={getVenueImage(venue)}
                                                    alt={venue.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="text-xl font-bold text-white">{venue.name}</h3>
                                                    <p className="text-white/90 text-sm flex items-center mt-1">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {[venue.location, venue.city, venue.state].filter(Boolean).join(', ')}
                                                    </p>
                                                </div>
                                                {/* Sports Tags */}
                                                {venue.sports && venue.sports.length > 0 && (
                                                    <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end">
                                                        {venue.sports.slice(0, 3).map(sport => (
                                                            <span key={sport} className="bg-indigo-600/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full">
                                                                {sport}
                                                            </span>
                                                        ))}
                                                        {venue.sports.length > 3 && (
                                                            <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full">
                                                                +{venue.sports.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Venue Details */}
                                            <div className="p-6">
                                                {/* Rating and Price */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-2">
                                                        {venue.rating > 0 && (
                                                            <>
                                                                <div className="flex items-center">
                                                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                    <span className="font-bold text-gray-900">{venue.rating.toFixed(1)}</span>
                                                                </div>
                                                                <span className="text-sm text-gray-500">({venue.reviewCount} reviews)</span>
                                                            </>
                                                        )}
                                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${venue.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {venue.approved ? 'Approved' : 'Pending'}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-indigo-600 text-lg">₹{venue.pricePerHour}</p>
                                                        <p className="text-xs text-gray-400">/hour</p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {venue.description && (
                                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{venue.description}</p>
                                                )}

                                                {/* Opening Hours */}
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{venue.openingTime} - {venue.closingTime}</span>
                                                </div>

                                                {/* Sports */}
                                                {venue.sports && venue.sports.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {venue.sports.map(sport => (
                                                            <span key={sport} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                                                                {sport}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Amenities */}
                                                {venue.amenities && venue.amenities.length > 0 && (
                                                    <div className="border-t border-gray-100 pt-4 mb-4">
                                                        <p className="text-xs font-semibold text-gray-500 mb-2">Amenities</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {venue.amenities.slice(0, 4).map(amenity => (
                                                                <span key={amenity} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                            {venue.amenities.length > 4 && (
                                                                <span className="text-xs text-gray-500">+{venue.amenities.length - 4} more</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Book Button */}
                                                <Link
                                                    to={`/player/book-venue/${venue._id}`}
                                                    className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                                                >
                                                    Book This Venue
                                                </Link>
                                            </div>
                                        </div>
                                    </SlideUp>
                                ))}
                            </div>
                        </StaggeredChildren>

                        {filteredVenues.length > itemsPerPage && (
                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredVenues.length / itemsPerPage)}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        title="No Venues Found"
                        description={
                            search || selectedState || selectedCity || sportFilter !== "All"
                                ? `We couldn't find any venues matching your criteria. Try adjusting your filters or search terms.`
                                : "No venues are available at the moment. Please check back later."
                        }
                        icon={
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        }
                        action={
                            (search || selectedState || selectedCity || sportFilter !== "All") && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )
                        }
                    />
                )}
            </div>

            <Footer />
        </div>
    );
}

