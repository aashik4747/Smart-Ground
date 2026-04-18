const mongoose = require("mongoose");

module.exports = mongoose.model("Ground", new mongoose.Schema({
    venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
    name: String, // e.g. "Pitch 1", "Main Turf"
    description: String,
    imageUrl: String,
    sport: String,
    pricePerHour: Number
}));
