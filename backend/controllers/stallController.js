const Stall = require("../models/Stall");

exports.createStall = async (req, res) => {
    try {
        const stall = await Stall.create({
            ...req.body,
            owner: req.user.id
        });
        res.status(201).json(stall);
    } catch (error) {
        console.error("[createStall] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

exports.getAllStallsAdmin = async (req, res) => {
    try {
        const stalls = await Stall.find().populate("owner", "name email");
        res.json(stalls);
    } catch (error) {
        console.error("[getAllStallsAdmin] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
