const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MatchRequest = require("./models/MatchRequest");
const User = require("./models/User");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-booking-system";

const seedMatches = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        console.log("Clearing existing matches...");
        await MatchRequest.deleteMany({});

        // Fetch some dummy users or create them if less than 2
        let users = await User.find({ role: { $in: ["player", "pending"] } }).limit(5);
        if (users.length < 2) {
            console.log("Not enough player users, creating dummy users...");
            const dummy1 = await User.create({
                name: "Alex Johnson",
                email: "alex@example.com",
                password: "password123",
                role: "player",
                reliabilityScore: 98,
                turfId: "TURF-1029"
            });
            const dummy2 = await User.create({
                name: "Maria Garcia",
                email: "maria@example.com",
                password: "password123",
                role: "player",
                reliabilityScore: 100,
                turfId: "TURF-3012"
            });
            const dummy3 = await User.create({
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: "password123",
                role: "player",
                reliabilityScore: 95,
                turfId: "TURF-4029"
            });
            users = [dummy1, dummy2, dummy3];
        }

        console.log(`Found/created ${users.length} dummy users.`);

        const matchesToCreate = [
            {
                // Match 1: PENDING MATCH (Requires Admin Approval)
                sport: "Football",
                date: new Date(Date.now() + 86400000 * 2),
                time: "18:00 - 19:00",
                location: "Marina Arena Sports Complex (Pitch A)",
                description: "This match is waiting for Admin Approval! Hosted by Alex.",
                requiredPlayers: 10,
                joinedPlayers: [users[0]._id],
                host: users[0]._id,
                status: "pending",
                isPrivate: false,
                pricePerPlayer: 150
            },
            {
                // Match 2: OPEN MATCH (Ready to Join)
                sport: "Cricket",
                date: new Date(Date.now() + 86400000 * 3),
                time: "07:00 - 10:00",
                location: "ECR Cricket Grounds (Pitch A)",
                description: "Approved and open to the public! Hosted by Maria.",
                requiredPlayers: 22,
                joinedPlayers: [users[1]._id],
                host: users[1]._id,
                status: "open",
                isPrivate: false,
                pricePerPlayer: 300
            },
            {
                // Match 3: CLOSED/FULL MATCH (Test Waitlisting)
                sport: "Badminton",
                date: new Date(Date.now() + 86400000 * 1), 
                time: "20:00 - 21:00",
                location: "Adyar Badminton Academy (Court B)",
                description: "This match is FULL! Try joining the Waitlist. Hosted by Rahul.",
                requiredPlayers: 2, // Max 2 players
                joinedPlayers: [users[2]._id, users[1]._id], // Filled by Rahul and Maria
                waitlistedPlayers: [],
                host: users[2]._id,
                status: "closed",
                isPrivate: false,
                pricePerPlayer: 0
            }
        ];

        await MatchRequest.insertMany(matchesToCreate);
        console.log(`Successfully seeded ${matchesToCreate.length} matches!`);
        
        process.exit(0);
    } catch (err) {
        console.error("Error seeding matches:", err);
        process.exit(1);
    }
};

seedMatches();
