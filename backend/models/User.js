const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["admin", "manager", "user", "pending"],
        default: "pending"
    },
    phone: String,
    status: {
        type: String,
        enum: ["active", "suspended", "banned"],
        default: "active"
    },
    profileImage: String,
    preferredSport: [String],
    otp: String,
    otpExpires: Date,
    // Gamification & Social Player Stats
    turfId: { type: String, unique: true, sparse: true },
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    reliabilityScore: { type: Number, default: 100 },
    mvpAwards: { type: Number, default: 0 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", UserSchema);
