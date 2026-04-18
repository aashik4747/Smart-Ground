const mongoose = require("mongoose");

module.exports = mongoose.model("MatchRequest", new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    sport: String,
    date: Date,
    time: String,
    location: String,
    description: String,
    requiredPlayers: Number,
    joinedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    waitlistedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { 
        type: String, 
        enum: ["pending", "open", "closed", "cancelled", "rejected"],
        default: "pending" 
    },
    isPrivate: { type: Boolean, default: false },
    pricePerPlayer: { type: Number, default: 0 }
}, { timestamps: true }));
