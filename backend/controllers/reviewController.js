const Review = require("../models/Review");
const Venue = require("../models/Venue");

// Add a review for a venue
exports.addReview = async (req, res) => {
    try {
        const { venueId, rating, comment } = req.body;
        const userId = req.user.id;

        // Check if venue exists
        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        // Check if user already reviewed this venue
        const existingReview = await Review.findOne({ venueId, userId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this venue" });
        }

        // Create review
        const review = await Review.create({
            venueId,
            userId,
            rating,
            comment
        });

        // Update venue rating and review count
        const allReviews = await Review.find({ venueId });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / allReviews.length;

        await Venue.findByIdAndUpdate(venueId, {
            rating: avgRating.toFixed(1),
            reviewCount: allReviews.length
        });

        // Populate user details for response
        const populatedReview = await Review.findById(review._id).populate("userId", "name profileImage");

        res.status(201).json({ success: true, review: populatedReview });
    } catch (error) {
        console.error("[addReview] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Get all reviews for a venue
exports.getVenueReviews = async (req, res) => {
    try {
        const { venueId } = req.params;

        const reviews = await Review.find({ venueId })
            .populate("userId", "name profileImage")
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.error("[getVenueReviews] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;

        const reviews = await Review.find({ userId })
            .populate("venueId", "name address city state images")
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.error("[getUserReviews] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Check if user owns the review
        if (review.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to update this review" });
        }

        // Update review
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();

        // Recalculate venue rating
        const allReviews = await Review.find({ venueId: review.venueId });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / allReviews.length;

        await Venue.findByIdAndUpdate(review.venueId, {
            rating: avgRating.toFixed(1),
            reviewCount: allReviews.length
        });

        const populatedReview = await Review.findById(review._id).populate("userId", "name profileImage");

        res.json({ success: true, review: populatedReview });
    } catch (error) {
        console.error("[updateReview] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Check if user owns the review
        if (review.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
        }

        const venueId = review.venueId;
        await Review.findByIdAndDelete(reviewId);

        // Recalculate venue rating
        const allReviews = await Review.find({ venueId });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

        await Venue.findByIdAndUpdate(venueId, {
            rating: avgRating.toFixed(1),
            reviewCount: allReviews.length
        });

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("[deleteReview] Error:", error.message);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
