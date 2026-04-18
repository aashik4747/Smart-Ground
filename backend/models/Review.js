const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Ensure one review per user per venue
reviewSchema.index({ venueId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
