import API from "./api";

// Admin
export const approveVenue = (id) => API.put(`/admin/venues/approve/${id}`);
export const getAllVenuesAdmin = () => API.get("/venues/admin/all");

// Public / User
export const getAllVenues = (search, state, city, sport, lat, lng, maxDistance) => {
    let queryString = "";
    const params = [];
    
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (state) params.push(`state=${encodeURIComponent(state)}`);
    if (city) params.push(`city=${encodeURIComponent(city)}`);
    if (sport) params.push(`sport=${encodeURIComponent(sport)}`);
    if (lat) params.push(`lat=${encodeURIComponent(lat)}`);
    if (lng) params.push(`lng=${encodeURIComponent(lng)}`);
    if (maxDistance) params.push(`maxDistance=${encodeURIComponent(maxDistance)}`);
    
    if (params.length > 0) {
        queryString = `?${params.join('&')}`;
    }
    
    return API.get(`/venues${queryString}`);
};

// Get single venue by ID
export const getVenueById = (venueId) => API.get(`/venues/${venueId}`);

// Get available slots for a venue on a specific date
export const getAvailableSlots = (venueId, date) => API.get(`/venues/${venueId}/slots/${date}`);

// Manager functions
export const createVenue = (venueData) => API.post("/venues", venueData);
export const updateVenue = (venueId, venueData) => API.put(`/venues/${venueId}`, venueData);
export const deleteVenue = (venueId) => API.delete(`/venues/${venueId}`);
export const getMyVenues = () => API.get("/venues/my-venues");
