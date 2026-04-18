const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Venue = require("./models/Venue");
const Ground = require("./models/Ground");
const User = require("./models/User");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smart-ground-stadium";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing venues and grounds
        console.log("Clearing existing venues and grounds...");
        await Venue.deleteMany({});
        await Ground.deleteMany({});

        // Fetch a manager or create a dummy manager to reference
        let managerUser = await User.findOne({ role: "manager" });
        if (!managerUser) {
            managerUser = await User.findOne();
        }

        const managerId = managerUser ? managerUser._id : new mongoose.Types.ObjectId();

        console.log("Seeding venues...");

        // Chennai Venues
        const chennaiVenues = [
            { name: "Marina Arena Sports Complex", location: "Marina Beach Road", state: "Tamil Nadu", city: "Chennai" },
            { name: "T-Nagar Turf Club", location: "T-Nagar", state: "Tamil Nadu", city: "Chennai" },
            { name: "Anna Nagar Football Ground", location: "Anna Nagar Tower Park", state: "Tamil Nadu", city: "Chennai" },
            { name: "OMR Tech Park Sports Zone", location: "OMR IT Expressway", state: "Tamil Nadu", city: "Chennai" },
            { name: "Velachery Indoor Courts", location: "Velachery Main Rd", state: "Tamil Nadu", city: "Chennai" },
            { name: "Guindy Athletic Fields", location: "Guindy", state: "Tamil Nadu", city: "Chennai" },
            { name: "Tambaram Sports Hub", location: "Tambaram Sanatorium", state: "Tamil Nadu", city: "Chennai" },
            { name: "Adyar Badminton Academy", location: "Adyar", state: "Tamil Nadu", city: "Chennai" },
            { name: "ECR Cricket Grounds", location: "East Coast Road", state: "Tamil Nadu", city: "Chennai" },
            { name: "Pallikaranai Multi-Sport Arena", location: "Pallikaranai Wetland boundary", state: "Tamil Nadu", city: "Chennai" }
        ];

        // Other Indian Cities Venues
        const otherVenues = [
            { name: "Mumbai Central Sports Complex", location: "Dadar West", state: "Maharashtra", city: "Mumbai" },
            { name: "Pune Tech Turf", location: "Hinjewadi", state: "Maharashtra", city: "Pune" },
            { name: "Bangalore Royal Grounds", location: "Koramangala", state: "Karnataka", city: "Bangalore" },
            { name: "Mysore Palace Athletics", location: "Chamrajpura", state: "Karnataka", city: "Mysore" },
            { name: "Delhi Capital Arena", location: "Connaught Place", state: "Delhi", city: "New Delhi" },
            { name: "Kolkata Salt Lake Complex", location: "Salt Lake Sector V", state: "West Bengal", city: "Kolkata" },
            { name: "Hyderabad Cyber Sports", location: "HITEC City", state: "Telangana", city: "Hyderabad" },
            { name: "Ahmedabad Motera Turf", location: "Motera", state: "Gujarat", city: "Ahmedabad" },
            { name: "Jaipur Pink City Palace Grounds", location: "Malviya Nagar", state: "Rajasthan", city: "Jaipur" },
            { name: "Cochin Coastal Arena", location: "Marine Drive", state: "Kerala", city: "Kochi" }
        ];

        const allVenuesBase = [...chennaiVenues, ...otherVenues];
        
        const createdVenues = [];
        for (const v of allVenuesBase) {
            const newVenue = await Venue.create({
                name: v.name,
                location: v.location,
                state: v.state,
                city: v.city,
                manager: managerId,
                approved: true
            });
            createdVenues.push(newVenue);
        }

        console.log(`Created ${createdVenues.length} venues.`);

        // Create 1-2 grounds per venue
        const sports = ["Football", "Cricket", "Badminton", "Tennis", "Basketball"];
        const groundsToCreate = [];

        for (const venue of createdVenues) {
            // Pick a random sport
            const sport1 = sports[Math.floor(Math.random() * sports.length)];
            let sport2 = sports[Math.floor(Math.random() * sports.length)];
            while (sport2 === sport1) {
                 sport2 = sports[Math.floor(Math.random() * sports.length)];
            }

            groundsToCreate.push({
                venue: venue._id,
                name: `${venue.name} - Pitch A`,
                description: `A fantastic ${sport1} facility.`,
                imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&q=60",
                sport: sport1,
                pricePerHour: Math.floor(Math.random() * 1500) + 500
            });

            // 50% chance to have a second ground
            if (Math.random() > 0.5) {
                groundsToCreate.push({
                    venue: venue._id,
                    name: `${venue.name} - Court B`,
                    description: `Premium ${sport2} area.`,
                    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=60",
                    sport: sport2,
                    pricePerHour: Math.floor(Math.random() * 1000) + 400
                });
            }
        }

        await Ground.insertMany(groundsToCreate);
        console.log(`Created ${groundsToCreate.length} grounds/pitches.`);

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
};

seedData();
