const mongoose = require("mongoose");

module.exports = mongoose.model("Booking", new mongoose.Schema({
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "confirmed" 
    }
}, { timestamps: true }));
