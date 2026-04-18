const mongoose = require("mongoose");

module.exports = mongoose.model("Stall", new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    eventName: String,
    price: Number,
    approved: Boolean
}));
