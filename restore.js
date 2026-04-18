const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./backend/models/User");

mongoose.connect("mongodb://127.0.0.1:27017/smart-booking-system").then(async () => {
    const hash = await bcrypt.hash("password123", 10);
    await User.updateOne(
        { email: "aashik230604@gmail.com" },
        { $set: { name: "Aashik", password: hash, role: "player", status: "active", phone: "7373750045" } },
        { upsert: true }
    );
    console.log("Restored original specific user account!");
    process.exit(0);
});
