const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
    try {
        const payment = await Payment.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json(payment);
    } catch (error) {
        console.error("[createPayment] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
