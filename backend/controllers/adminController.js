const User = require("../models/User");

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const players = await User.countDocuments({ role: "player" });
        const stallOwners = await User.countDocuments({ role: "stallOwner" });
        const admins = await User.countDocuments({ role: "admin" });

        res.json({
            totalUsers,
            players,
            stallOwners,
            admins
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) {
            query.role = role;
        }
        const users = await User.find(query).select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status, turfId, mvpAwards, reliabilityScore } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (role) user.role = role;
        if (status) user.status = status;
        if (turfId !== undefined) user.turfId = turfId;
        if (mvpAwards !== undefined) user.mvpAwards = mvpAwards;
        if (reliabilityScore !== undefined) user.reliabilityScore = reliabilityScore;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const Venue = require("../models/Venue");
const Ground = require("../models/Ground");
const Booking = require("../models/Booking");
const MatchRequest = require("../models/MatchRequest");
const Stall = require("../models/Stall");
const Payment = require("../models/Payment");

exports.getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find().populate("manager", "name email");
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.createVenue = async (req, res) => {
    try {
        const { name, location, state, city, manager } = req.body;
        
        const venue = await Venue.create({
            name,
            location,
            state,
            city,
            manager: manager || null,
            approved: true // Admin created venues are auto-approved
        });
        
        res.status(201).json({ message: "Venue created successfully", venue });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, state, city, manager, approved } = req.body;
        
        const venue = await Venue.findById(id);
        if (!venue) return res.status(404).json({ message: "Venue not found" });
        
        if (name) venue.name = name;
        if (location) venue.location = location;
        if (state) venue.state = state;
        if (city) venue.city = city;
        if (manager !== undefined) venue.manager = manager;
        if (approved !== undefined) venue.approved = approved;
        
        await venue.save();
        res.json({ message: "Venue updated successfully", venue });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.deleteVenue = async (req, res) => {
    try {
        const { id } = req.params;
        
        const venue = await Venue.findById(id);
        if (!venue) return res.status(404).json({ message: "Venue not found" });
        
        await Venue.findByIdAndDelete(id);
        res.json({ message: "Venue deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.approveVenue = async (req, res) => {
    try {
        const { id } = req.params;
        
        const venue = await Venue.findByIdAndUpdate(
            id,
            { approved: true },
            { new: true }
        ).populate("manager", "name email");
        
        if (!venue) return res.status(404).json({ message: "Venue not found" });
        
        res.json({ message: "Venue approved successfully", venue });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email role")
            .populate("slot")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await MatchRequest.find()
            .populate("host", "name email")
            .populate("joinedPlayers", "name")
            .populate("booking")
            .sort({ createdAt: -1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.approveMatch = async (req, res) => {
    try {
        const match = await MatchRequest.findByIdAndUpdate(
            req.params.id,
            { status: "open" },
            { new: true }
        ).populate("host", "name email").populate("joinedPlayers", "name");
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.rejectMatch = async (req, res) => {
    try {
        const match = await MatchRequest.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        ).populate("host", "name email").populate("joinedPlayers", "name");
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllStalls = async (req, res) => {
    try {
        const stalls = await Stall.find().populate("owner", "name email");
        res.json(stalls);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Ground Management (formerly venue manager features)
exports.getAllGrounds = async (req, res) => {
    try {
        const grounds = await Ground.find().populate("venue", "name location state city").sort({ createdAt: -1 });
        res.json(grounds);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.createGround = async (req, res) => {
    try {
        const { name, description, imageUrl, sport, venue, pricePerHour, width, length, turfType } = req.body;
        
        const ground = await Ground.create({
            name,
            description,
            imageUrl,
            sport,
            venue,
            pricePerHour,
            width,
            length,
            turfType
        });
        
        res.status(201).json({ message: "Ground created successfully", ground });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateGround = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl, sport, venue, pricePerHour, width, length, turfType } = req.body;
        
        const ground = await Ground.findById(id);
        if (!ground) return res.status(404).json({ message: "Ground not found" });
        
        if (name) ground.name = name;
        if (description !== undefined) ground.description = description;
        if (imageUrl !== undefined) ground.imageUrl = imageUrl;
        if (sport) ground.sport = sport;
        if (venue !== undefined) ground.venue = venue;
        if (pricePerHour !== undefined) ground.pricePerHour = pricePerHour;
        if (width !== undefined) ground.width = width;
        if (length !== undefined) ground.length = length;
        if (turfType !== undefined) ground.turfType = turfType;
        
        await ground.save();
        res.json({ message: "Ground updated successfully", ground });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.deleteGround = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ground = await Ground.findById(id);
        if (!ground) return res.status(404).json({ message: "Ground not found" });
        
        await Ground.findByIdAndDelete(id);
        res.json({ message: "Ground deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Venue Manager Stats (now admin can view)
exports.getVenueManagerStats = async (req, res) => {
    try {
        const totalVenues = await Venue.countDocuments();
        const totalGrounds = await Ground.countDocuments();
        const approvedVenues = await Venue.countDocuments({ approved: true });
        const pendingVenues = await Venue.countDocuments({ approved: false });
        
        res.json({
            totalVenues,
            totalGrounds,
            approvedVenues,
            pendingVenues
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
