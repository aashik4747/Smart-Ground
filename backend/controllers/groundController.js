const Ground = require("../models/Ground");
const Venue = require("../models/Venue");

exports.seedGrounds = async (req, res) => {
    try {
        await Ground.deleteMany({});
        await Venue.deleteMany({});

        // Create Venues
        const venue1 = await Venue.create({
            name: "City Sports Complex",
            location: "Downtown",
            description: "A large sports complex with multiple facilities.",
            manager: "000000000000000000000000",
        });
        const venue2 = await Venue.create({
            name: "Greenfield Stadium",
            location: "North Suburb",
            description: "A beautiful stadium with lush fields.",
            manager: "000000000000000000000001",
        });

        // Create Grounds
        const grounds = await Ground.create([
            {
                venue: venue1._id,
                name: "Turf Match Pitch",
                description: "7v7 ASTRO Turf Pitch.",
                imageUrl: "https://images.unsplash.com/photo-1518605368461-1e1e11af25f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                sport: "Football",
                pricePerHour: 1200
            },
            {
                venue: venue1._id,
                name: "Main Cricket Ground",
                description: "Full size cricket ground.",
                imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                sport: "Cricket",
                pricePerHour: 3000
            },
            {
                venue: venue2._id,
                name: "Indoor Badminton Court",
                description: "Wooden floor indoor court.",
                imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                sport: "Badminton",
                pricePerHour: 800
            }
        ]);

        res.json({ message: `Success! Added ${grounds.length} grounds to your database.`, grounds });
    } catch (error) {
        console.error("[seedGrounds] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Search Grounds
exports.searchGrounds = async (req, res) => {
    try {
        const { q, sport, location, state, city } = req.query;
        let query = {};

        // 1. Optional State/City Venue Filter
        let venueQuery = {};
        if (state) venueQuery.state = state;
        if (city) venueQuery.city = city;

        let validVenueIds = null;
        if (Object.keys(venueQuery).length > 0) {
            const venues = await Venue.find(venueQuery).select('_id');
            validVenueIds = venues.map(v => v._id);
            // Enforce this valid venue filter at the ground top level
            query.venue = { $in: validVenueIds };
        }

        // 2. Text Search Query ('q')
        if (q) {
            let qVenueQuery = {
                $or: [
                    { name: { $regex: q, $options: "i" } },
                    { location: { $regex: q, $options: "i" } }
                ]
            };
            if (validVenueIds) {
                 qVenueQuery._id = { $in: validVenueIds };
            }

            const qVenues = await Venue.find(qVenueQuery).select('_id');
            const qVenueIds = qVenues.map(v => v._id);

            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { name: { $regex: q, $options: "i" } },
                    { sport: { $regex: q, $options: "i" } },
                    { venue: { $in: qVenueIds } }
                ]
            });
        }

        // 3. Sport Exact Match / Regex
        if (sport) {
            query.sport = { $regex: sport, $options: "i" };
        }

        const grounds = await Ground.find(query).populate("venue", "name location state city");
        res.json(grounds);
    } catch (error) {
        console.error("[searchGrounds] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Get Ground Details
exports.getGroundById = async (req, res) => {
    try {
        const ground = await Ground.findById(req.params.id).populate("venue");
        if (!ground) return res.status(404).json({ success: false, message: "Ground not found" });
        res.json(ground);
    } catch (error) {
        console.error("[getGroundById] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
