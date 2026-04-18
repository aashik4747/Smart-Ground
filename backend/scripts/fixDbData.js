const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const MatchRequest = require("../models/MatchRequest");
require("dotenv").config({ path: "../.env" });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-booking-system");
        console.log("Connected to DB:", process.env.MONGO_URI);

        const dummyEmails = [
            "player1@test.com",
            "player2@test.com",
            "player3@test.com",
            "player4@test.com",
            "player5@test.com"
        ];

        // 1. Delete matches hosted by dummy users
        const dummyUsers = await User.find({ email: { $in: dummyEmails } });
        const dummyIds = dummyUsers.map(u => u._id);
        
        if (dummyIds.length > 0) {
            const matchesResult = await MatchRequest.deleteMany({ host: { $in: dummyIds } });
            console.log(`Deleted ${matchesResult.deletedCount} matches hosted by dummy users.`);
            
            // 2. Delete the dummy users
            const usersResult = await User.deleteMany({ _id: { $in: dummyIds } });
            console.log(`Deleted ${usersResult.deletedCount} dummy users.`);
        } else {
            console.log("No dummy users found.");
        }

        // 3. Ensure the three specific requested users exist
        const targetEmails = ["alex@example.com", "maria@example.com", "rahul@example.com"];
        const existingTargets = await User.find({ email: { $in: targetEmails } });
        const existingEmails = existingTargets.map(u => u.email);

        const newUsers = [];
        
        for (const email of targetEmails) {
            if (!existingEmails.includes(email)) {
                newUsers.push({
                    name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
                    email: email,
                    password: "password123", // Will be hashed by pre-save hook
                    role: "player",
                    status: "active"
                });
            }
        }

        for (const u of newUsers) {
            const created = new User(u);
            await created.save();
        }

        console.log(`Added ${newUsers.length} newly requested users (Alex, Maria, Rahul if missing).`);

        console.log("Database connection & clean up perfect!");
        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

run();
