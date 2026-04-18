const mongoose = require("mongoose");

module.exports = mongoose.model("Slot", new mongoose.Schema({
    ground: { type: mongoose.Schema.Types.ObjectId, ref: "Ground" },
    date: String,
    time: String,
    available: { type: Boolean, default: true }
}));
