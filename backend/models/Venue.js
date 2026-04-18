const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    sports: [{
        type: String,
        required: true
    }],
    images: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    pricePerHour: {
        type: Number,
        required: true
    },
    openingTime: {
        type: String,
        required: true,
        default: "08:00"
    },
    closingTime: {
        type: String,
        required: true,
        default: "22:00"
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    approved: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Geospatial index for location-based search
venueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Venue", venueSchema);
