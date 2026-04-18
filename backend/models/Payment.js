const mongoose = require("mongoose");

module.exports = mongoose.model("Payment", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    status: String
}, { timestamps: true }));
