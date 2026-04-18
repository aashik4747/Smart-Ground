const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const MatchRequest = require('../models/MatchRequest');
const User = require('../models/User');

const seedMatches = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smart-booking-system");
        console.log("MongoDB Connected");

        // Find users to act as hosts
        const users = await User.find({ role: 'player' }).limit(3);
        if (users.length === 0) {
            console.log("No player users found. Adding a dummy host.");
            const dummyUser = await User.create({
                name: 'Seed Player',
                email: 'seedplayer1@test.com',
                password: 'password123',
                role: 'player'
            });
            users.push(dummyUser);
        }

        const host1 = users[0]._id;
        const host2 = users.length > 1 ? users[1]._id : host1;
        const host3 = users.length > 2 ? users[2]._id : host1;

        // Clear existing open matches for a clean seed
        await MatchRequest.deleteMany({ status: "open", description: { $regex: /Pickup|Competitive|Morning|Friendly/i } });

        const matches = [
            {
                sport: "Football",
                date: new Date(Date.now() + 86400000 * 2), // 2 days from now
                time: "18:00",
                location: "Downtown City Stadium",
                description: "Friendly 11v11 pickup match. Bring both light and dark shirts!",
                requiredPlayers: 22,
                joinedPlayers: [host1],
                host: host1,
                status: "open"
            },
            {
                sport: "Cricket",
                date: new Date(Date.now() + 86400000 * 3), // 3 days from now
                time: "16:00",
                location: "Willow Creek Cricket Ground",
                description: "Weekend T20 match. Must bring your own kit.",
                requiredPlayers: 22,
                joinedPlayers: [host2],
                host: host2,
                status: "open"
            },
            {
                sport: "Badminton",
                date: new Date(Date.now() + 86400000 * 1), // Tomorrow
                time: "07:00",
                location: "Elite Indoor Arena",
                description: "Morning casual doubles. Shuttles provided.",
                requiredPlayers: 4,
                joinedPlayers: [host3],
                host: host3,
                status: "open"
            },
            {
                sport: "Basketball",
                date: new Date(Date.now() + 86400000 * 4), // 4 days from now
                time: "19:00",
                location: "Community Rec Center Court",
                description: "Competitive full-court 5v5 runs. High skill level preferred.",
                requiredPlayers: 10,
                joinedPlayers: [host1],
                host: host1,
                status: "open"
            },
            {
                sport: "Tennis",
                date: new Date(Date.now() + 86400000 * 5),
                time: "10:00",
                location: "Central Park Tennis Courts",
                description: "Looking for a partner for singles. Intermediate level.",
                requiredPlayers: 2,
                joinedPlayers: [host2],
                host: host2,
                status: "open"
            }
        ];

        await MatchRequest.insertMany(matches);
        console.log(`Successfully seeded ${matches.length} matches across different sports.`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedMatches();
