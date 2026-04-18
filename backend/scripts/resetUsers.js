const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config({ path: "../.env" });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sportDB");
        console.log("Connected to DB");

        // Keep all admins
        const admins = await User.find({ role: "admin" });
        const adminIds = admins.map(a => a._id);
        console.log(`Found ${admins.length} admin accounts.`);

        // Delete everyone else
        const deleteRes = await User.deleteMany({ _id: { $nin: adminIds } });
        console.log(`Deleted ${deleteRes.deletedCount} non-admin accounts.`);

        const hashedPassword = await bcrypt.hash("password123", 10);
        
        const newUsers = [
            {
                name: "Alex",
                email: "alex@example.com",
                password: hashedPassword, // Note: pre save hook won't hash if not modified, wait, if we use setup with create, it bypasses or uses pre-save? 
                role: "player",
                status: "active"
            },
            {
                name: "Maria",
                email: "maria@example.com",
                password: hashedPassword,
                role: "player",
                status: "active"
            },
            {
                name: "Rahul",
                email: "rahul@example.com",
                password: hashedPassword,
                role: "player",
                status: "active"
            }
        ];

        // Wait, UserSchema.pre("save") hashes it! So we should just provide the raw password if we use User.create
        // Let's modify so it just passes "password123" and lets the pre-save hook do the work.
        for (const u of newUsers) {
            u.password = "password123"; 
            const created = new User(u);
            await created.save();
        }

        console.log("Added Alex, Maria, and Rahul.");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
