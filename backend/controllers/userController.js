const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/jwt");

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
};

exports.setInitialRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Validate role input
        const validRoles = ["user", "manager"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role selected." });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Only allow changing if role is still pending
        if (user.role !== "pending") {
            return res.status(400).json({ message: "Role is already set." });
        }

        user.role = role;
        await user.save();

        // Re-issue token with new role so Context updates correctly
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: jwtExpire }
        );

        res.json({ success: true, message: "Role updated successfully", user, token });
    } catch (error) {
        console.error("Set Role Error:", error);
        res.status(500).json({ message: "Server error setting role." });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

    // Handle nested objects or arrays if sent as JSON strings (common with FormData)
    if (updateData.preferredSport && typeof updateData.preferredSport === 'string') {
        try {
            // If it's a JSON string, parse it. If it's just a single string "Cricket", make it an array.
            if (updateData.preferredSport.startsWith("[")) {
                updateData.preferredSport = JSON.parse(updateData.preferredSport);
            } else {
                updateData.preferredSport = [updateData.preferredSport];
            }
        } catch (e) {
            console.error("Error parsing preferredSport", e);
        }
    }

        // Check for Turf ID Uniqueness explicitly to send correct message
        if (updateData.turfId) {
            const existing = await User.findOne({ turfId: updateData.turfId });
            if (existing && existing._id.toString() !== req.user.id.toString()) {
                return res.status(400).json({ message: "Username already taken. try different username..." });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        ).select("-password");

        res.json(user);
    } catch (error) {
        console.error("Update Profile Error:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username already taken. try different username..." });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // e.g., 'active', 'suspended', 'banned'

        const validStatuses = ['active', 'suspended', 'banned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, message: `User status updated to ${status}`, user });
    } catch (error) {
        console.error("Update User Status Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const myId = req.user.id;

        if (targetId === myId) return res.status(400).json({ message: "Cannot follow yourself" });

        await User.findByIdAndUpdate(targetId, { $addToSet: { followers: myId } });
        await User.findByIdAndUpdate(myId, { $addToSet: { following: targetId } });

        res.json({ success: true, message: "Successfully followed user." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const myId = req.user.id;

        await User.findByIdAndUpdate(targetId, { $pull: { followers: myId } });
        await User.findByIdAndUpdate(myId, { $pull: { following: targetId } });

        res.json({ success: true, message: "Successfully unfollowed user." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getDiscoverablePlayers = async (req, res) => {
    try {
        const myId = req.user.id;
        // Find players who are not the current user
        const players = await User.find({ role: "player", _id: { $ne: myId } })
            .select("name email turfId skillLevel mvpAwards reliabilityScore profileImage followers");
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
