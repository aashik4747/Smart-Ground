const Booking = require("../models/Booking");
const Venue = require("../models/Venue");
const Slot = require("../models/Slot");

exports.getBookedSlots = async (req, res) => {
    try {
        const { venueId, date } = req.query;
        if (!venueId || !date) return res.status(400).json({ message: "Venue ID and date are required" });

        const bookings = await Booking.find({
            venueId,
            date,
            status: { $in: ['confirmed', 'pending'] }
        });

        const bookedTimes = bookings.map(b => ({
            startTime: b.startTime,
            endTime: b.endTime
        }));

        res.json({ bookedTimes });
    } catch (error) {
        console.error("[getBookedSlots] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { venueId, date, startTime, endTime, hostMatch, requiredPlayers, isPrivate, pricePerPlayer } = req.body;

        // Check if venue exists
        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        // Prevent double booking - check for existing bookings in the same time range
        const existingBooking = await Booking.findOne({
            venueId,
            date,
            status: { $in: ['confirmed', 'pending'] },
            $or: [
                // New booking starts during an existing booking
                { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
                // New booking ends during an existing booking
                { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
                // New booking completely covers an existing booking
                { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ 
                success: false, 
                message: "This time slot is already booked. Please choose a different time." 
            });
        }

        // Calculate total price
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        const hours = endHour - startHour;
        const totalPrice = hours * venue.pricePerHour;

        const booking = await Booking.create({
            venueId,
            userId: req.user.id,
            date,
            startTime,
            endTime,
            totalPrice,
            status: "confirmed"
        });

        // If hosting a match, auto-spawn Match Request tied to this booking
        if (hostMatch) {
            const MatchRequest = require("../models/MatchRequest");
            
            await MatchRequest.create({
                sport: venue.sports[0] || "Football",
                requiredPlayers: requiredPlayers || 10,
                date: date,
                time: `${startTime} - ${endTime}`,
                location: `${venue.name} (${venue.address})`,
                description: "Auto-generated community match from booking slot.",
                host: req.user.id,
                joinedPlayers: [req.user.id],
                status: "pending",
                isPrivate: isPrivate || false,
                pricePerPlayer: pricePerPlayer || 0
            });
        }

        res.status(201).json({ success: true, booking });
    } catch (error) {
        console.error("[createBooking] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate("venueId", "name address city state images pricePerHour sports")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("[getMyBookings] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Check if user owns the booking
        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
        }

        // Only allow cancellation if booking is not already completed
        if (booking.status === 'completed' || booking.status === 'cancelled') {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot cancel a completed or already cancelled booking" 
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("[cancelBooking] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
