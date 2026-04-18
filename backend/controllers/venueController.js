const Venue = require("../models/Venue");
const Ground = require("../models/Ground");
const Booking = require("../models/Booking");

exports.createVenue = async (req, res) => {
    try {
        const venueData = { ...req.body };
        
        // Parse sports and amenities if sent as JSON strings
        if (venueData.sports && typeof venueData.sports === 'string') {
            try {
                venueData.sports = JSON.parse(venueData.sports);
            } catch (e) {
                console.error("Error parsing sports:", e);
            }
        }
        
        if (venueData.amenities && typeof venueData.amenities === 'string') {
            try {
                venueData.amenities = JSON.parse(venueData.amenities);
            } catch (e) {
                console.error("Error parsing amenities:", e);
            }
        }
        
        // Handle image uploads
        if (req.files && req.files.length > 0) {
            venueData.images = req.files.map(file => `/uploads/${file.filename}`);
        }
        
        // Set default location coordinates if not provided (using state/city as placeholder)
        if (!venueData.location || !venueData.location.coordinates) {
            // For now, use a default location (should be improved with geocoding)
            venueData.location = {
                type: 'Point',
                coordinates: [77.2090, 28.6139] // Default Delhi coordinates
            };
        }
        
        const venue = await Venue.create({
            ...venueData,
            manager: req.user.id
        });
        res.status(201).json(venue);
    } catch (error) {
        console.error("[createVenue] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

exports.getVenues = async (req, res) => {
    try {
        const { search, sport, state, city, lat, lng, maxDistance } = req.query;
        let query = { approved: true, isActive: true };

        // Location-based search using geospatial query
        if (lat && lng) {
            const distance = maxDistance || 50000; // Default 50km
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: distance
                }
            };
        }

        // Text search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // State and city filters
        if (state) {
            query.state = state;
        }

        if (city) {
            query.city = city;
        }

        // Sport filter
        if (sport) {
            query.sports = { $in: [new RegExp(`^${sport}$`, "i")] };
        }

        const venues = await Venue.find(query)
            .populate("manager", "name email")
            .lean();

        res.json(venues);
    } catch (error) {
        console.error("[getVenues] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

exports.getAllVenuesAdmin = async (req, res) => {
    try {
        const venues = await Venue.find().populate("manager", "name email");
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get venues for the logged-in manager
exports.getMyVenues = async (req, res) => {
    try {
        const venues = await Venue.find({ manager: req.user.id }).populate("manager", "name email");
        res.json({ success: true, venues });
    } catch (error) {
        console.error("[getMyVenues] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

exports.approveVenue = async (req, res) => {
    try {
        const venue = await Venue.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        res.json(venue);
    } catch (error) {
        console.error("[approveVenue] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Get single venue by ID
exports.getVenueById = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).populate("manager", "name email");
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        res.json(venue);
    } catch (error) {
        console.error("[getVenueById] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Generate available slots dynamically based on openingTime and closingTime
exports.getAvailableSlots = async (req, res) => {
    try {
        const { venueId, date } = req.params;
        
        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        // Get all bookings for this venue on the specified date
        const bookings = await Booking.find({
            venueId,
            date,
            status: { $in: ['confirmed', 'pending'] }
        });

        // Generate time slots based on opening and closing time
        const slots = generateTimeSlots(venue.openingTime, venue.closingTime, bookings);

        res.json({ success: true, slots, pricePerHour: venue.pricePerHour });
    } catch (error) {
        console.error("[getAvailableSlots] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Helper function to generate time slots
function generateTimeSlots(openingTime, closingTime, bookings) {
    const slots = [];
    const [openHour, openMin] = openingTime.split(':').map(Number);
    const [closeHour, closeMin] = closingTime.split(':').map(Number);
    
    let currentHour = openHour;
    let currentMin = openMin;
    
    while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        
        // Check if this slot is booked
        const isBooked = bookings.some(booking => {
            const bookingStart = booking.startTime;
            const bookingEnd = booking.endTime;
            return timeString >= bookingStart && timeString < bookingEnd;
        });
        
        slots.push({
            time: timeString,
            available: !isBooked
        });
        
        // Increment by 1 hour
        currentHour += 1;
    }
    
    return slots;
}

// Update venue
exports.updateVenue = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        // Check if user is the manager of this venue or is admin
        if (venue.manager.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to update this venue" });
        }

        const venueData = { ...req.body };
        
        // Parse sports and amenities if sent as JSON strings
        if (venueData.sports && typeof venueData.sports === 'string') {
            try {
                venueData.sports = JSON.parse(venueData.sports);
            } catch (e) {
                console.error("Error parsing sports:", e);
            }
        }
        
        if (venueData.amenities && typeof venueData.amenities === 'string') {
            try {
                venueData.amenities = JSON.parse(venueData.amenities);
            } catch (e) {
                console.error("Error parsing amenities:", e);
            }
        }
        
        // Handle image uploads (append new images to existing ones)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            venueData.images = [...(venue.images || []), ...newImages];
        }
        
        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.id,
            venueData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, venue: updatedVenue });
    } catch (error) {
        console.error("[updateVenue] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Delete venue
exports.deleteVenue = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        // Check if user is the manager of this venue or is admin
        if (venue.manager.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to delete this venue" });
        }

        await Venue.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Venue deleted successfully" });
    } catch (error) {
        console.error("[deleteVenue] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
