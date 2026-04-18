const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Venue = require("./models/Venue");
const Ground = require("./models/Ground");
const Stall = require("./models/Stall");
const Booking = require("./models/Booking");
const MatchRequest = require("./models/MatchRequest");
const Payment = require("./models/Payment");

mongoose.connect("mongodb://127.0.0.1:27017/smart-booking-system")
    .then(() => console.log("MongoDB Connected for Comprehensive Seeding"))
    .catch(err => console.log("Mongo Connection Error: ", err));

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Venue.deleteMany({});
        await Ground.deleteMany({});
        await Stall.deleteMany({});
        await Booking.deleteMany({});
        await MatchRequest.deleteMany({});
        await Payment.deleteMany({});

        const password = "password123";

        // 1. Create Users
        const usersData = [];
        usersData.push({ name: "Alex Johnson", email: "alex@example.com", password, role: "user", status: "active", reliabilityScore: 98 });
        usersData.push({ name: "Maria Garcia", email: "maria@example.com", password, role: "user", status: "active", reliabilityScore: 100 });
        usersData.push({ name: "Rahul Sharma", email: "rahul@example.com", password, role: "user", status: "active", reliabilityScore: 95 });

        for (let i = 1; i <= 3; i++) usersData.push({ name: `Manager ${i}`, email: `manager${i}@test.com`, password, role: "manager", status: "active" });
        for (let i = 1; i <= 3; i++) usersData.push({ name: `Stall Owner ${i}`, email: `stall${i}@test.com`, password, role: "manager", status: "active" });
        usersData.push({ name: "System Admin", email: "admin@test.com", password: "admin123", role: "admin", status: "active" });

        const users = await User.create(usersData);

        const players = users.filter(u => u.role === "user");
        const managers = users.filter(u => u.role === "manager");
        const stallOwners = users.filter(u => u.role === "manager");

        // 2. Create Venues
        const venues = await Venue.create([
            { 
                name: "Elite Sports Arena", 
                description: "Premium sports facility with multiple grounds",
                address: "123 Sports Complex, Downtown",
                city: "Mumbai",
                state: "Maharashtra",
                location: {
                    type: "Point",
                    coordinates: [72.8777, 19.0760]
                },
                sports: ["Football", "Cricket"],
                images: ["https://images.unsplash.com/photo-1518605368461-1e1e11af25f6"],
                amenities: ["Parking", "Changing Rooms", "Floodlights"],
                pricePerHour: 2000,
                openingTime: "06:00",
                closingTime: "22:00",
                manager: managers[0]._id, 
                approved: true,
                isActive: true,
                rating: 4.5,
                reviewCount: 50
            },
            { 
                name: "Greenfield Stadium", 
                description: "Professional cricket ground with international standards",
                address: "456 Greenfield Road, North Suburbs",
                city: "Mumbai",
                state: "Maharashtra",
                location: {
                    type: "Point",
                    coordinates: [72.8777, 19.0760]
                },
                sports: ["Cricket"],
                images: ["https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"],
                amenities: ["Parking", "Spectator Seating", "Floodlights"],
                pricePerHour: 5000,
                openingTime: "07:00",
                closingTime: "20:00",
                manager: managers[1]._id, 
                approved: true,
                isActive: true,
                rating: 4.8,
                reviewCount: 120
            },
            { 
                name: "Urban Turf Club", 
                description: "Indoor badminton and tennis courts",
                address: "789 Eastside Boulevard, Eastside",
                city: "Mumbai",
                state: "Maharashtra",
                location: {
                    type: "Point",
                    coordinates: [72.8777, 19.0760]
                },
                sports: ["Badminton", "Tennis"],
                images: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea"],
                amenities: ["AC", "Changing Rooms", "Equipment Rental"],
                pricePerHour: 500,
                openingTime: "08:00",
                closingTime: "22:00",
                manager: managers[2]._id, 
                approved: true,
                isActive: true,
                rating: 4.2,
                reviewCount: 35
            },
            { 
                name: "Pinnacle Indoor Courts", 
                description: "Multi-sport indoor facility",
                address: "321 West End, West End",
                city: "Mumbai",
                state: "Maharashtra",
                location: {
                    type: "Point",
                    coordinates: [72.8777, 19.0760]
                },
                sports: ["Badminton", "Basketball"],
                images: ["https://images.unsplash.com/photo-1504450758481-7338eba7524a"],
                amenities: ["AC", "Parking", "Cafeteria"],
                pricePerHour: 800,
                openingTime: "09:00",
                closingTime: "21:00",
                manager: managers[0]._id, 
                approved: false,
                isActive: true,
                rating: 4.0,
                reviewCount: 20
            }
        ]);

        // 3. Create Grounds
        const grounds = await Ground.create([
            { venue: venues[0]._id, name: "Alpha Pitch", description: "FIFA standard 11v11 Turf", imageUrl: "https://images.unsplash.com/photo-1518605368461-1e1e11af25f6", sport: "Football", pricePerHour: 2000 },
            { venue: venues[0]._id, name: "Beta Pitch", description: "7v7 Astro Turf", imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55", sport: "Football", pricePerHour: 1000 },
            { venue: venues[1]._id, name: "Main Oval", description: "Professional Cricket Ground", imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e", sport: "Cricket", pricePerHour: 5000 },
            { venue: venues[2]._id, name: "Court 1", description: "Wooden Indoor Court", imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea", sport: "Badminton", pricePerHour: 500 }
        ]);

        // 4. Create Bookings & Payments
        const bookings = [];
        for (let i = 0; i < 15; i++) {
            const player = players[i % players.length];
            const venue = venues[i % venues.length];
            const status = i % 4 === 0 ? "cancelled" : "confirmed";
            const date = new Date(Date.now() + 86400000 * i).toISOString().split('T')[0];
            const startTime = "10:00";
            const endTime = "12:00";
            const totalPrice = venue.pricePerHour * 2;

            const booking = await Booking.create({
                venueId: venue._id,
                userId: player._id,
                date: date,
                startTime: startTime,
                endTime: endTime,
                totalPrice: totalPrice,
                status: status
            });
            bookings.push(booking);

            if (status === "confirmed") {
                await Payment.create({
                    user: player._id,
                    amount: totalPrice,
                    status: "completed"
                });
            }
        }

        // 5. Create 3 Specific Match Requests for Testing
        await MatchRequest.create([
            {
                booking: bookings[0]?._id,
                sport: "Football",
                date: new Date(Date.now() + 86400000 * 2),
                time: "18:00 - 19:00",
                location: venues[0]?.name || "Local Venue",
                description: "This match is waiting for Admin Approval! Hosted by Alex.",
                requiredPlayers: 10,
                joinedPlayers: [players[0]._id],
                host: players[0]._id,
                status: "pending",
                isPrivate: false,
                pricePerPlayer: 150
            },
            {
                booking: bookings[1]?._id,
                sport: "Cricket",
                date: new Date(Date.now() + 86400000 * 3),
                time: "07:00 - 10:00",
                location: venues[1]?.name || "Local Venue",
                description: "Approved and open to the public! Hosted by Maria.",
                requiredPlayers: 22,
                joinedPlayers: [players[1]._id],
                host: players[1]._id,
                status: "open",
                isPrivate: false,
                pricePerPlayer: 300
            },
            {
                booking: bookings[2]?._id,
                sport: "Badminton",
                date: new Date(Date.now() + 86400000 * 1), 
                time: "20:00 - 21:00",
                location: venues[2]?.name || "Local Venue",
                description: "This match is FULL! Try joining the Waitlist. Hosted by Rahul.",
                requiredPlayers: 2, // Max 2 players
                joinedPlayers: [players[2]._id, players[1]._id], // Filled by Rahul and Maria
                waitlistedPlayers: [],
                host: players[2]._id,
                status: "closed",
                isPrivate: false,
                pricePerPlayer: 0
            }
        ]);

        // 6. Create Stalls
        await Stall.create([
            { owner: stallOwners[0]._id, eventName: "Weekend Football Derby", price: 1500, approved: true },
            { owner: stallOwners[1]._id, eventName: "Corporate Cricket League", price: 3000, approved: true },
            { owner: stallOwners[2]._id, eventName: "Summer Sports Fest", price: 1200, approved: false }
        ]);

        console.log("Database Seeded Successfully with highly relational data!");
        process.exit();
    } catch (error) {
        console.error("Error seeding dataset:", error);
        process.exit(1);
    }
};

seedData();
